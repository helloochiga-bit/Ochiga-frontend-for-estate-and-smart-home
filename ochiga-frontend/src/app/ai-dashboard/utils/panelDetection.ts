export function detectPanelType(message: string): string | null {
  const msg = message.toLowerCase().trim();

  // 🔹 Map common keywords/phrases to panel names
  if (msg.includes("light")) return "lights";
  if (msg.includes("wallet") || msg.includes("fund")) return "wallet";
  if (msg.includes("cctv") || msg.includes("camera")) return "cctv";
  if (msg.includes("visitor")) return "visitors";
  if (msg.includes("estate")) return "estate";
  if (msg.includes("home")) return "home";
  if (msg.includes("room")) return "room";
  if (msg.includes("payment")) return "payments";
  if (msg.includes("utility")) return "utilities";
  if (msg.includes("community")) return "community";
  if (msg.includes("notification")) return "notifications";
  if (msg.includes("health")) return "health";
  if (msg.includes("message")) return "message";
  if (msg.includes("iot")) return "iot";
  if (msg.includes("assistant")) return "assistant";
  if (msg.includes("ai")) return "ai";

  // 🔹 New smart home panels
  if (msg.includes("meter") || msg.includes("electricity")) return "smart_meter";
  if (msg.includes("ir")) return "ir_sensor";
  if (
    msg.includes("sensor") ||
    msg.includes("motion") ||
    msg.includes("temperature") ||
    msg.includes("air") ||
    msg.includes("humidity")
  ) return "sensors";

  // 🔹 New: device discovery triggers
  if (
    msg.includes("connect device") ||
    msg.includes("add device") ||
    msg.includes("scan devices") ||
    msg.includes("discover device") ||
    msg.includes("pair device") ||
    msg.includes("new device")
  ) {
    return "devices";
  }

  // Default: no panel detected
  return null;
}
