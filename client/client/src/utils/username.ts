// Username storage and retrieval using localStorage
const USERNAME_KEY = 'tea-education-username';

export function getUsername(): string {
  return localStorage.getItem(USERNAME_KEY) || '';
}

export function setUsername(username: string): void {
  if (username.trim()) {
    localStorage.setItem(USERNAME_KEY, username.trim());
  }
}

export function clearUsername(): void {
  localStorage.removeItem(USERNAME_KEY);
}

