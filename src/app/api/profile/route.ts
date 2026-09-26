import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { profileUpdateSchema } from "@/lib/validators";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await createServerSupabase();
  const { data, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = profileUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const db = await createServerSupabase();
  const { data, error } = await db.from("profiles").update({ ...parsed.data, handle: parsed.data.handle?.toLowerCase() }).eq("id", user.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ profile: data });
}
