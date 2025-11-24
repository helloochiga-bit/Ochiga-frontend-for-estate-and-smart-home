// src/services/index.ts
"use client";

import { apiRequest } from "@/lib/api";
import { deviceService as _deviceService } from "./deviceService";
import { aiService as _aiService } from "./aiService";
import { authService as _authService } from "./authService";

/** -----------------------------
 * Utility to automatically add JWT
 * ----------------------------- */
function withAuth(fn: Function) {
  return async (...args: any[]) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (err: any) {
      console.error("❌ API Error:", err.message);
      throw err;
    }
  };
}

/** -----------------------------
 * AUTH MODULE
 * ----------------------------- */
export const authService = {
  signup: withAuth(_authService.signup),
  login: withAuth(_authService.login),
  logout: () => {
    localStorage.removeItem("ochiga_token");
  },
};

/** -----------------------------
 * DEVICE MODULE
 * ----------------------------- */
export const deviceService = {
  discoverDevices: withAuth(_deviceService.discoverDevices),
  getDevices: withAuth(_deviceService.getDevices),
  triggerDeviceAction: withAuth(_deviceService.triggerDeviceAction),
};

/** -----------------------------
 * AI MODULE
 * ----------------------------- */
export const aiService = {
  chat: withAuth(_aiService.chat),
  analyze: withAuth(_aiService.analyze),
};

/** -----------------------------
 * ESTATE / HOME MODULES
 * ----------------------------- */
export const estateService = {
  getEstates: () => apiRequest("/estates"),
  getEstateById: (id: string) => apiRequest(`/estates/${id}`),
  createHome: (payload: any) => apiRequest("/homes", { method: "POST", body: JSON.stringify(payload) }),
  getHomes: (estateId?: string) =>
    apiRequest(`/homes${estateId ? `?estateId=${estateId}` : ""}`),
  getRooms: (homeId: string) => apiRequest(`/rooms?homeId=${homeId}`),
  createRoom: (payload: any) => apiRequest("/rooms", { method: "POST", body: JSON.stringify(payload) }),
};

/** -----------------------------
 * WALLET MODULE
 * ----------------------------- */
export const walletService = {
  getWallet: (userId: string) => apiRequest(`/wallets/${userId}`),
  createTransaction: (payload: any) => apiRequest("/wallet-transactions", { method: "POST", body: JSON.stringify(payload) }),
};

/** -----------------------------
 * NOTIFICATIONS MODULE
 * ----------------------------- */
export const notificationService = {
  getNotifications: () => apiRequest("/notifications"),
  markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: "POST" }),
};

/** -----------------------------
 * VISITORS MODULE
 * ----------------------------- */
export const visitorService = {
  getVisitors: (homeId?: string) => apiRequest(`/visitors${homeId ? `?homeId=${homeId}` : ""}`),
  updateVisitor: (id: string, payload: any) => apiRequest(`/visitors/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

/** -----------------------------
 * ESTATE SERVICES / MAINTENANCE
 * ----------------------------- */
export const estateManagementService = {
  getEstateServices: (estateId: string) => apiRequest(`/estate-services?estateId=${estateId}`),
  createEstateService: (payload: any) => apiRequest("/estate-services", { method: "POST", body: JSON.stringify(payload) }),
  getMaintenanceRequests: (estateId?: string) => apiRequest(`/maintenance-requests${estateId ? `?estateId=${estateId}` : ""}`),
  createMaintenanceRequest: (payload: any) => apiRequest("/maintenance-requests", { method: "POST", body: JSON.stringify(payload) }),
};
