import { apiRequest } from "@/lib/api";

export const estateService = {
  createEstate: (data: { name: string; address: string }) =>
    apiRequest("/estates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getEstateServices: (estateId: string) =>
    apiRequest(`/estates/${estateId}/services`),

  addEstateDevice: (estateId: string, data: { name: string; type: string }) =>
    apiRequest(`/estates/${estateId}/devices`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addHome: (estateId: string, data: { name: string; residentId: string }) =>
    apiRequest(`/estates/${estateId}/homes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
