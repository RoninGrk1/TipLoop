import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { requestRefund } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { paymentId } = (await request.json()) as { paymentId?: string };
  if (!paymentId) return NextResponse.json({ error: "Missing paymentId." }, { status: 400 });
  try { await requestRefund(paymentId, user.id); return NextResponse.json({ ok: true }); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Refund failed." }, { status: 400 }); }
}
