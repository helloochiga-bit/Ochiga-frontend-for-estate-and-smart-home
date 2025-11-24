import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Optional: helper to get current user
 */
export async function getSupabaseUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
