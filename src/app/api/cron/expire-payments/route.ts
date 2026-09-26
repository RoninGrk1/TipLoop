import { NextResponse } from "next/server";
import { expireStalePayments } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ expired: 0, note: "unconfigured" });
  return NextResponse.json({ expired: await expireStalePayments() });
}
