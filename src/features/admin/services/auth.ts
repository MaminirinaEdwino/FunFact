const ADMIN_KEY = 'isAdmin';

export function isAdmin(): boolean {
  try {
    return localStorage.getItem(ADMIN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loginAdmin(): void {
  try {
    localStorage.setItem(ADMIN_KEY, 'true');
  } catch {}
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_KEY);
  } catch {}
}
