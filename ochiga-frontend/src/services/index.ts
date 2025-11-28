// src/services/index.ts
"use client";

import { apiRequest } from "@/lib/api";
import { deviceService as _deviceService } from "./deviceService";
import { aiService as _aiService } from "./aiService";
import { authService as _authService } from "./authService";

/** Simple wrapper to centralize error logging */
function withAuth<T extends (...a: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...(args as any));
    } catch (err: any) {
      console.error("❌ API Error:", err?.message ?? err);
      throw err;
    }
  };
}

export const authService = {
  signup: withAuth(_authService.signup),
  login: withAuth(_authService.login),
  logout: withAuth(_authService.logout),
  completeOnboarding: withAuth(_authService.completeOnboarding),
};

export const deviceService = {
  discoverDevices: withAuth(_deviceService.discoverDevices),
  getDevices: withAuth(_deviceService.getDevices),
  triggerDeviceAction: withAuth(_deviceService.triggerDeviceAction),
};

export const aiService = {
  chat: withAuth(_aiService.chat),
  analyze: withAuth(_aiService.analyze),
};

export const estateService = {
  getEstates: () => apiRequest("/estates"),
  getEstateById: (id: string) => apiRequest(`/estates/${id}`),
  createHome: (payload: any) => apiRequest("/homes", { method: "POST", body: JSON.stringify(payload) }),
  getHomes: (estateId?: string) =>
    apiRequest(`/homes${estateId ? `?estateId=${estateId}` : ""}`),
  getRooms: (homeId: string) => apiRequest(`/rooms?homeId=${homeId}`),
  createRoom: (payload: any) => apiRequest("/rooms", { method: "POST", body: JSON.stringify(payload) }),
};

export const walletService = {
  getWallet: (userId: string) => apiRequest(`/wallets/${userId}`),
  createTransaction: (payload: any) => apiRequest("/wallet-transactions", { method: "POST", body: JSON.stringify(payload) }),
};

export const notificationService = {
  getNotifications: () => apiRequest("/notifications"),
  markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: "POST" }),
};

export const visitorService = {
  getVisitors: (homeId?: string) => apiRequest(`/visitors${homeId ? `?homeId=${homeId}` : ""}`),
  updateVisitor: (id: string, payload: any) => apiRequest(`/visitors/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

export const estateManagementService = {
  getEstateServices: (estateId: string) => apiRequest(`/estate-services?estateId=${estateId}`),
  createEstateService: (payload: any) => apiRequest("/estate-services", { method: "POST", body: JSON.stringify(payload) }),
  getMaintenanceRequests: (estateId?: string) => apiRequest(`/maintenance-requests${estateId ? `?estateId=${estateId}` : ""}`),
  createMaintenanceRequest: (payload: any) => apiRequest("/maintenance-requests", { method: "POST", body: JSON.stringify(payload) }),
};
