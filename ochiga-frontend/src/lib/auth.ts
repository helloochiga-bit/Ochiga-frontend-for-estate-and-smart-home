// src/lib/auth.ts
"use client";

/**
 * Centralized auth storage helpers.
 * - token stored in localStorage as ochiga_token
 * - user stored in localStorage as ochiga_user (JSON string)
 * - role set as a non-httpOnly cookie named "role" for Next middleware compatibility
 *
 * NOTE: If you switch to HttpOnly cookies on the backend, remove localStorage usage and rely on cookies + credentials: 'include'
 */

const TOKEN_KEY = "ochiga_token";
const USER_KEY = "ochiga_user";
const ROLE_COOKIE = "role";

export function saveAuth(token: string | null, user: any | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn("localStorage token set failed", e);
  }

  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.warn("localStorage user set failed", e);
  }

  // keep role cookie in sync for middleware/proxy that expects a cookie named "role"
  try {
    if (user && user.role) {
      // Set cookie for 1 day
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; expires=${expiry.toUTCString()};`;
    } else {
      // delete cookie
      document.cookie = `${ROLE_COOKIE}=; Max-Age=0; path=/;`;
    }
  } catch (e) {
    // In non-browser environment this will fail; ignore
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function getUser(): any | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${ROLE_COOKIE}=; Max-Age=0; path=/;`;
  } catch (e) {}
}
