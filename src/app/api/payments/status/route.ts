import { NextResponse } from "next/server";
import { getPaymentById } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const payment = await getPaymentById(id);
  if (!payment) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ id: payment.id, handle: payment.handle, status: payment.status, asset: payment.asset, network: payment.network, grossCents: payment.gross_cents, feeCents: payment.fee_cents, netCents: payment.net_cents, checkoutUrl: payment.checkout_url, expiresAt: payment.expires_at, paidAt: payment.paid_at, refundedAt: payment.refunded_at });
}
