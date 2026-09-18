const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || 'Something went wrong');
  return data;
}
