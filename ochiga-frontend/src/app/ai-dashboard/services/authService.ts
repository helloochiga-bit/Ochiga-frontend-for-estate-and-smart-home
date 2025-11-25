// src/app/ai-dashboard/services/authService.ts
import { supabase } from "../../../lib/supabase-client";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const token = data.session?.access_token;
  if (!token) throw new Error("Failed to get access token");

  return { user: data.user, token };
}
