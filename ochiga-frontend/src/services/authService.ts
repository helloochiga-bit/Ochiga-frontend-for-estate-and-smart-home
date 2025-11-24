import { apiRequest } from "@/lib/api";

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }) {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    localStorage.setItem("ochiga_token", res.access_token);
    localStorage.setItem("ochiga_role", res.role); // resident or manager
    return res;
  },

  logout() {
    localStorage.removeItem("ochiga_token");
    localStorage.removeItem("ochiga_role");
  },

  getRole() {
    return localStorage.getItem("ochiga_role");
  },

  getToken() {
    return localStorage.getItem("ochiga_token");
  },
};
