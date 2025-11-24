import { apiRequest } from "@/lib/api";

export const roomService = {
  createRoom: (homeId: string, data: any) =>
    apiRequest(`/homes/${homeId}/rooms`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRooms: (homeId: string) => apiRequest(`/homes/${homeId}/rooms`),

  createRule: (roomId: string, data: any) =>
    apiRequest(`/rooms/${roomId}/rules`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRules: (roomId: string) => apiRequest(`/rooms/${roomId}/rules`),
};
