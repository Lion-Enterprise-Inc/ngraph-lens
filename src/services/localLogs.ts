export interface LocalFoodLog {
  uid: string;
  thumbnail: string; // base64 resized image
  items: any[];
  location_lat: number | null;
  location_lng: number | null;
  location_label: string | null;
  restaurant_name: string | null;
  memo: string | null;
  created_at: string;
}

const STORAGE_KEY = 'eat-food-logs';

function getLogs(): LocalFoodLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: LocalFoodLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export async function imageToThumbnail(file: File, maxSize = 400): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = url;
  });
}

export async function addLog(data: {
  image: File;
  items: any[];
  location_lat?: number | null;
  location_lng?: number | null;
  location_label?: string | null;
  restaurant_name?: string | null;
  memo?: string | null;
}): Promise<LocalFoodLog> {
  const thumbnail = await imageToThumbnail(data.image);
  const log: LocalFoodLog = {
    uid: crypto.randomUUID(),
    thumbnail,
    items: data.items,
    location_lat: data.location_lat ?? null,
    location_lng: data.location_lng ?? null,
    location_label: data.location_label ?? null,
    restaurant_name: data.restaurant_name ?? null,
    memo: data.memo ?? null,
    created_at: new Date().toISOString(),
  };
  const logs = getLogs();
  logs.unshift(log);
  saveLogs(logs);
  return log;
}

export function listLogs(): LocalFoodLog[] {
  return getLogs();
}

export function getLog(uid: string): LocalFoodLog | null {
  return getLogs().find(l => l.uid === uid) ?? null;
}

export function deleteLog(uid: string) {
  saveLogs(getLogs().filter(l => l.uid !== uid));
}

export function getLogCount(): number {
  return getLogs().length;
}
