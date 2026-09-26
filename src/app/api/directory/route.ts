import { NextResponse } from "next/server";
import { createServiceSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().toLowerCase().replace(/[%(),]/g, "");
  if (!isSupabaseConfigured()) return NextResponse.json({ creators: [], unconfigured: true });
  const db = createServiceSupabase();
  let query = db.from("profiles").select("id, handle, display_name, bio, avatar_url, is_verified, preferred_asset").eq("is_public", true).order("created_at", { ascending: false }).limit(48);
  if (q) query = query.or(`handle.ilike.%${q}%,display_name.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creators: data ?? [] });
}
