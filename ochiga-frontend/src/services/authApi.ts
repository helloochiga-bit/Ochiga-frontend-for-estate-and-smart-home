// src/services/authApi.ts
import { API_BASE_URL } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL || "http://localhost:5000";

/**
 * Low-level auth API wrappers that call your backend endpoints:
 * - POST /auth/login  (body: { usernameOrEmail OR email, password })
 * - POST /auth/signup (body: { email, password, full_name })
 * - POST /auth/logout (optional)
 */

export async function loginApi(emailOrUsername: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail: emailOrUsername, password }),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Login failed");
  return data;
}

export async function signupApi(payload: { email: string; password: string; full_name?: string }) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Signup failed");
  return data;
}

export async function onboardingCompleteApi(user_id: string, username: string, password: string) {
  const res = await fetch(`${BASE_URL}/onboarding/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, username, password }),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Onboarding failed");
  return data;
}
