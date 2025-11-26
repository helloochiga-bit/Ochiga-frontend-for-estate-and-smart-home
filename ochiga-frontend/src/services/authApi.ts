const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail: email, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerResidentApi(inviteToken: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register-resident`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteToken, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}
