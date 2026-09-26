import { createServerSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
import type { Profile } from "@/types";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getSessionProfile(): Promise<{ userId: string; profile: Profile | null } | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (!isSupabaseConfigured()) return { userId: user.id, profile: null };
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { userId: user.id, profile: (data as Profile | null) ?? null };
}
