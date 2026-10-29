// Central API service — all backend product & repair calls go through here.
// In dev, Vite proxies /api → http://localhost:5001
// In production, set VITE_API_URL to your Render backend URL.

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const TOKEN_STORAGE_KEY = 'proofpocket_token';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      // Clean up invalid or expired token
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new Event('proofpocket-auth-expired'));
    }
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// ── Products ──────────────────────────────────────────────
export const getProducts = () => request('/products');

export const getProduct = (id) => request(`/products/${id}`);

export const createProduct = (body) =>
  request('/products', { method: 'POST', body: JSON.stringify(body) });

export const updateProduct = (id, body) =>
  request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: 'DELETE' });

// ── Repairs (sub-document operations) ────────────────────
export const addRepair = (productId, repair) =>
  request(`/products/${productId}/repairs`, {
    method: 'POST',
    body: JSON.stringify(repair),
  });

export const deleteRepair = (productId, repairId) =>
  request(`/products/${productId}/repairs/${repairId}`, { method: 'DELETE' });
