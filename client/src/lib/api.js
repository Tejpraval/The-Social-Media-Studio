const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8081').replace(/\/$/, '');
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

function resolveApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith(`/api/${API_VERSION}/`)) return `${API_URL}${path}`;
  if (path.startsWith('/api/')) return `${API_URL}/api/${API_VERSION}${path.slice(4)}`;
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function api(path, options = {}) {
  const token = localStorage.getItem('creatoros.token');
  const response = await fetch(resolveApiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
