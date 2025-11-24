// src/services/authService.ts
import { apiRequest } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authService = {
  // -----------------------------
  // Signup / Register
  // -----------------------------
  async signup(payload: {
    email: string;
    username: string;
    password: string;
    role?: string;
    estateId?: string;
  }) {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Signup failed");

    // Save token
    localStorage.setItem("ochiga_token", data.token);
    localStorage.setItem("ochiga_role", payload.role || "resident");

    return data; // returns { user, token }
  },

  // -----------------------------
  // Login
  // -----------------------------
  async login(payload: { usernameOrEmail: string; password: string }) {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Login failed");

    // Save token
    localStorage.setItem("ochiga_token", data.token);
    localStorage.setItem("ochiga_role", data.user.role || "resident");

    return data; // returns { user, token }
  },

  // -----------------------------
  // Logout
  // -----------------------------
  logout() {
    localStorage.removeItem("ochiga_token");
    localStorage.removeItem("ochiga_role");
  },

  // -----------------------------
  // Get current token & role
  // -----------------------------
  getToken() {
    return localStorage.getItem("ochiga_token");
  },
  getRole() {
    return localStorage.getItem("ochiga_role");
  },
};
