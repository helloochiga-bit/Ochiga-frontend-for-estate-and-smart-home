export function detectPanelType(message: string): string | null {
  const msg = message.toLowerCase().trim();

  // -------------------------------
  // Core panels (resident phrasing)
  // -------------------------------
  if (msg.includes("light") || msg.includes("turn on") || msg.includes("turn off") || msg.includes("dim")) return "lights";
  if (msg.includes("wallet") || msg.includes("fund") || msg.includes("balance")) return "wallet";
  if (msg.includes("cctv") || msg.includes("camera") || msg.includes("view camera") || msg.includes("live feed")) return "cctv";
  if (msg.includes("visitor") || msg.includes("guest") || msg.includes("manage visitor")) return "visitors";
  if (msg.includes("estate") || msg.includes("property") || msg.includes("my home")) return "estate";
  if (msg.includes("room") || msg.includes("bedroom") || msg.includes("living room")) return "room";
  if (msg.includes("payment") || msg.includes("pay bill")) return "payments";
  if (msg.includes("utility") || msg.includes("electricity") || msg.includes("water") || msg.includes("meter")) return "utilities";
  if (msg.includes("community") || msg.includes("neighbors")) return "community";
  if (msg.includes("notification") || msg.includes("alert") || msg.includes("message")) return "notifications";
  if (msg.includes("health") || msg.includes("temperature") || msg.includes("humidity") || msg.includes("air quality")) return "health";
  if (msg.includes("message") || msg.includes("chat") || msg.includes("text")) return "message";
  if (msg.includes("iot") || msg.includes("smart device")) return "iot";
  if (msg.includes("assistant") || msg.includes("ai")) return "assistant";

  // -------------------------------
  // Smart home-specific panels
  // -------------------------------
  if (msg.includes("electricity usage") || msg.includes("smart meter") || msg.includes("check meter")) return "smart_meter";
  if (msg.includes("ir device") || msg.includes("remote control") || msg.includes("ir sensor")) return "ir_sensor";
  if (msg.includes("sensor") || msg.includes("motion") || msg.includes("temperature") || msg.includes("air") || msg.includes("humidity")) return "sensors";

  // -------------------------------
  // Device discovery / pairing
  // -------------------------------
  if (
    msg.includes("connect device") ||
    msg.includes("add device") ||
    msg.includes("scan devices") ||
    msg.includes("discover device") ||
    msg.includes("pair device") ||
    msg.includes("new device") ||
    msg.includes("find device")
  ) {
    return "devices";
  }

  // -------------------------------
  // Default: no panel detected
  // -------------------------------
  return null;
}
