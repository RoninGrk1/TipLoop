import { NextResponse } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL("/login", url.origin));
  if (code) {
    const supabase = await createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
