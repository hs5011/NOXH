import { API_BASE_URL } from '../constants';

const normalize = (path: string) => {
  const cleanedBase = API_BASE_URL.replace(/\/$/, '');
  const cleanedPath = path.replace(/^\//, '');
  return `${cleanedBase}/${cleanedPath}`.replace(/\/\/+/g, '/');
};

export const fetchJson = async (path: string) => {
  const apiUrl = normalize(path);
  let res = await fetch(apiUrl);

  if (res.ok) {
    return await res.json();
  }

  // Fallback: try local file path with index.json for static GH Pages mode
  if (res.status === 404) {
    const fallbackUrl = normalize(`${path.replace(/\/$/, '')}/index.json`);
    res = await fetch(fallbackUrl);
    if (res.ok) {
      return await res.json();
    }
  }

  const text = await res.text();
  throw new Error(`api fetch failed ${res.status} ${res.statusText} (${apiUrl}) - ${text}`);
};
