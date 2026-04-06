import { authHeaders } from './auth';

const API_BASE = 'https://dev-backend.ngraph.jp/api/eat';

export interface FoodLog {
  uid: string;
  image_url: string;
  items: any[];
  location_lat: number | null;
  location_lng: number | null;
  location_label: string | null;
  restaurant_name: string | null;
  memo: string | null;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
}

export async function createFoodLog(data: {
  image: File;
  items: any[];
  location_lat?: number | null;
  location_lng?: number | null;
  location_label?: string | null;
  restaurant_name?: string | null;
  memo?: string | null;
}): Promise<FoodLog> {
  const form = new FormData();
  form.append('image', data.image);
  form.append('items', JSON.stringify(data.items));
  if (data.location_lat != null) form.append('location_lat', String(data.location_lat));
  if (data.location_lng != null) form.append('location_lng', String(data.location_lng));
  if (data.location_label) form.append('location_label', data.location_label);
  if (data.restaurant_name) form.append('restaurant_name', data.restaurant_name);
  if (data.memo) form.append('memo', data.memo);

  const res = await fetch(`${API_BASE}/food-logs`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) throw new Error('Failed to save');
  const json = await res.json();
  return json.result;
}

export async function listFoodLogs(page = 1, limit = 20): Promise<{ logs: FoodLog[]; total: number }> {
  const res = await fetch(`${API_BASE}/food-logs?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  const json = await res.json();
  return json.result;
}

export async function getFoodLog(uid: string): Promise<FoodLog> {
  const res = await fetch(`${API_BASE}/food-logs/${uid}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Log not found');
  const json = await res.json();
  return json.result;
}

export async function deleteFoodLog(uid: string): Promise<void> {
  const res = await fetch(`${API_BASE}/food-logs/${uid}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function toggleShare(uid: string): Promise<{ is_public: boolean; share_token: string | null }> {
  const res = await fetch(`${API_BASE}/food-logs/${uid}/share`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to toggle share');
  const json = await res.json();
  return json.result;
}

export async function getSharedLog(token: string): Promise<FoodLog & { user_display_name?: string; user_avatar_url?: string }> {
  const res = await fetch(`${API_BASE}/share/${token}`);
  if (!res.ok) throw new Error('Shared log not found');
  const json = await res.json();
  return json.result;
}
