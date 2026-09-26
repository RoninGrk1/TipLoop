import { NextResponse } from "next/server";
import { paymentsLiveEnabled } from "@/lib/payments/provider";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ ok: true, service: "tiploop", time: new Date().toISOString(), supabase: isSupabaseConfigured(), paymentsLive: paymentsLiveEnabled() });
}
