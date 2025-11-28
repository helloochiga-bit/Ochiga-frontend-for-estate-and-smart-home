// src/services/authService.ts
import { loginApi, signupApi, onboardingCompleteApi } from "./authApi";
import { saveAuth, clearAuth, getToken as _getToken } from "@/lib/auth";

export const authService = {
  async login(usernameOrEmail: string, password: string) {
    const data = await loginApi(usernameOrEmail, password);
    // backend returns { user, token }
    const token = data.token ?? null;
    const user = data.user ?? null;

    // save locally for client-side needs + set role cookie
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
    // backend returns updated user
    const token = localStorage.getItem("ochiga_token") || null;
    const user = data.user ?? null;
    // Refresh stored user
    saveAuth(token, user);
    return data;
  },

  logout() {
    // If backend has /auth/logout endpoint, you can call it here (optional)
    clearAuth();
  },

  getToken() {
    return _getToken();
  },

  getUser() {
    try {
      const raw = localStorage.getItem("ochiga_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
};
