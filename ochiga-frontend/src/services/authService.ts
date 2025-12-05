// src/services/authService.ts
import { loginApi, signupApi, onboardingCompleteApi } from "./authApi";
import { saveAuth, clearAuth, getToken as _getToken } from "@/lib/auth";

export const authService = {
  async login(usernameOrEmail: string, password: string) {
    const data = await loginApi(usernameOrEmail, password);
    const token = data.token ?? null;
    const user = data.user ?? null;
    saveAuth(token, user);
    return { user, token };
  },

  async signup(payload: { email: string; password: string; full_name?: string }) {
    const data = await signupApi(payload);
    const token = data.token ?? null;
    const user = data.user ?? null;
    saveAuth(token, user);
    return { user, token };
  },

  async completeOnboarding(user_id: string, username: string, password: string) {
    const data = await onboardingCompleteApi(user_id, username, password);
    const token = localStorage.getItem("ochiga_token") || null;
    const user = data.user ?? null;
    saveAuth(token, user);
    return data;
  },

  async logout() {             // <-- FIXED
    clearAuth();
    return true;               // ensures Promise<any>
  },

  getToken() {
    return _getToken();
  },

  getUser() {
    try {
      const raw = localStorage.getItem("ochiga_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
