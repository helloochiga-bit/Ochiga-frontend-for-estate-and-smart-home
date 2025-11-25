// src/app/ai-dashboard/services/aiService.ts
import { apiRequest } from "./api";

interface AutomationResponse {
  name?: string;
  action?: any;
  trigger?: any;
  message?: string;
  metadata?: { panel?: string };
}

interface AiChatResult {
  reply: string;
  panel: string | null;
  raw?: AutomationResponse;
  error?: string;
}

/**
 * aiService.chat:
 * - Calls backend automation AI endpoint (/automations/ai-suggest) as a best-effort AI assistant.
 * - If estateId is not present in localStorage, sends null; backend may reject — we handle errors gracefully.
 */
export const aiService = {
  async chat(prompt: string): Promise<AiChatResult> {
    const estateId = typeof window !== "undefined" ? localStorage.getItem("ochiga_estate") : null;

    try {
      const payload = { prompt, estateId };

      const data: AutomationResponse = await apiRequest("/automations/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // ✅ stringify the body
      });

      const reply =
        data?.name && data?.action
          ? `Automation created: "${data.name}". Trigger: ${JSON.stringify(data.trigger)} Action: ${JSON.stringify(
              data.action
            )}`
          : data?.message || "I've processed your instruction.";

      const panel = data?.metadata?.panel || null;

      return { reply, panel, raw: data };
    } catch (err: any) {
      console.warn("aiService.chat error:", err?.message || err);
      return {
        reply: "Sorry — AI service unavailable or could not create automation.",
        panel: null,
        error: err?.message,
      };
    }
  },

  /**
   * previewAutomation:
   * - Convert natural language prompt into structured automation JSON WITHOUT saving it.
   */
  async previewAutomation(prompt: string) {
    try {
      const estateId = typeof window !== "undefined" ? localStorage.getItem("ochiga_estate") : null;

      const data: AutomationResponse = await apiRequest("/automations/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, estateId }), // ✅ stringify here too
      });

      return { ok: true, data };
    } catch (err: any) {
      return { ok: false, error: err?.message || String(err) };
    }
  },
};
