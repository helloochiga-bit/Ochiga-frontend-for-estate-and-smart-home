import { apiRequest } from "@/lib/api";

export const IotApi = {
  // Get devices owned by current user (home-level)
  getMyDevices: () => apiRequest("/iot/my-devices"),

  // Get devices assigned to estate
  getEstateDevices: () => apiRequest("/iot/estate-devices"),

  // Create a new device
  createDevice: (data: { name: string; type: string; isEstateLevel?: boolean }) =>
    apiRequest("/iot/devices", { method: "POST", body: JSON.stringify(data) }),

  // Control a device
  controlDevice: (
    deviceId: string,
    data: { action: "on" | "off" | "set-temp"; value?: any }
  ) => apiRequest(`/iot/devices/${deviceId}/control`, { method: "POST", body: JSON.stringify(data) }),

  // Get device logs
  getDeviceLogs: (deviceId: string) => apiRequest(`/iot/devices/${deviceId}/logs`),
};
