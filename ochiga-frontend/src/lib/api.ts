// src/lib/api.ts
import { getToken } from "./auth";

/**
 * Generic API helper. Uses NEXT_PUBLIC_API_URL or fallback to localhost:5000.
 * Automatically attaches Authorization header when token exists.
 * Uses credentials: 'include' by default to allow cookie-based sessions too.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions: RequestInit = {
    credentials: options.credentials ?? "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ? (options.headers as Record<string, string>) : {}),
    },
  };

  // Ensure no body is passed for GET/HEAD
  const method = (fetchOptions.method || "GET").toUpperCase();
  if ((method === "GET" || method === "HEAD") && (fetchOptions as any).body) {
    delete (fetchOptions as any).body;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

  let data: any = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText || "API request failed";
    const err: any = new Error(message);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}
