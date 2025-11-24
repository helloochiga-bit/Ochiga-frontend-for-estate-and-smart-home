// src/lib/api.ts
export const API_BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    : "http://localhost:5000/api";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("ochiga_token")
      : null;

  const headers: any = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "❌ API ERROR:",
        path,
        response.status,
        response.statusText,
        data
      );
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (err: any) {
    console.error("❌ FETCH FAILED:", err.message);
    throw err;
  }
}
