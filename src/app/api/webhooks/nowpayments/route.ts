import { NextResponse } from "next/server";
import { applyProviderStatus, nowPaymentsToStatus } from "@/lib/payments/service";
import { verifyNowPaymentsSignature } from "@/lib/payments/provider";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get("x-nowpayments-sig");
  if (!verifyNowPaymentsSignature(raw, signature)) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  let payload: Record<string, unknown>;
  try { payload = JSON.parse(raw) as Record<string, unknown>; } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  const eventId = String(payload.id ?? payload.payment_id ?? payload.invoice_id ?? `${payload.order_id}:${payload.payment_status}`);
  const result = await applyProviderStatus({
    provider: "nowpayments", eventId,
    providerPaymentId: payload.invoice_id ? String(payload.invoice_id) : String(payload.id ?? ""),
    orderId: payload.order_id ? String(payload.order_id) : null,
    nextStatus: nowPaymentsToStatus(payload),
    cryptoAmount: payload.pay_amount != null ? String(payload.pay_amount) : undefined,
    raw: payload,
  });
  return NextResponse.json({ ok: true, ...result });
}
