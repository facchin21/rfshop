const STORAGE_KEY = 'rfshop.token';

let token: string | null = null;

function storage() {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage;
}

export function getAuthToken() {
  return token;
}

export function setAuthToken(next: string | null) {
  token = next;
  const box = storage();
  if (!box) {
    return;
  }
  if (next) {
    box.setItem(STORAGE_KEY, next);
  } else {
    box.removeItem(STORAGE_KEY);
  }
}

export function readStoredToken() {
  const box = storage();
  const saved = box?.getItem(STORAGE_KEY) ?? null;
  token = saved;
  return saved;
}
