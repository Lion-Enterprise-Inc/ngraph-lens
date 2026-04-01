const API_BASE = 'https://dev-backend.ngraph.jp/api';

export interface QuickExplainItem {
  name_jp: string;
  name_en: string;
  price: number;
  description: string;
  description_local?: string;
  allergens?: string[];
  ingredients?: string[];
  source: 'db' | 'ai';
  is_new?: boolean;
  menu_uid?: string;
  image_url?: string;
  narrative?: {
    story?: string;
    texture?: string;
    how_to_eat?: string;
    pairing?: string;
    kid_friendly?: boolean;
  };
  verification_rank?: string;
  taste_values?: Record<string, number>;
  serving?: { style?: string; portion?: string; temperature?: string };
  restrictions?: string[];
  estimated_calories?: string;
  confidence?: number;
  category?: string;
  nfg_code?: string;
}

export interface QuickExplainResponse {
  result: {
    items: QuickExplainItem[];
    items_count: number;
  };
  message: string;
  status_code: number;
}

export async function quickExplain(
  image: File,
  language: string,
  restaurantSlug?: string
): Promise<QuickExplainResponse> {
  const form = new FormData();
  form.append('image', image);
  form.append('language', language);
  if (restaurantSlug) form.append('restaurant_slug', restaurantSlug);

  const res = await fetch(`${API_BASE}/menus/quick-explain`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
