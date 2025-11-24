import { apiRequest } from "@/lib/api";

export const aiService = {
  chat: (message: string) =>
    apiRequest("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  analyze: (payload: any) =>
    apiRequest("/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ payload }),
    }),
};
