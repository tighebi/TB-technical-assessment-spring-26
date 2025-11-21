/**
 * Username utility - manages username storage and retrieval
 * 
 * Uses browser's localStorage to persist username across page refreshes
 */

// Key used to store username in localStorage
const USERNAME_KEY = 'tea-education-username';

/**
 * Retrieves username from localStorage
 * Returns empty string if no username is stored
 */
export function getUsername(): string {
  return localStorage.getItem(USERNAME_KEY) || '';
}

/**
 * Saves username to localStorage
 * Only saves if username is not empty (after trimming whitespace)
 */
export function setUsername(username: string): void {
  if (username.trim()) {
    localStorage.setItem(USERNAME_KEY, username.trim());
  }
}

/**
 * Removes username from localStorage
 * Used when user wants to clear their stored name
 */
export function clearUsername(): void {
  localStorage.removeItem(USERNAME_KEY);
}

