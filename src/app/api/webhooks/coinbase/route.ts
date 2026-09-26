import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { applyProviderStatus } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
function verify(raw: string, signature: string | null, secret: string | undefined) {
  if (!secret || !signature) return false;
  const digest = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(digest); const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const raw = await request.text();
  if (!verify(raw, request.headers.get("x-cc-webhook-signature"), process.env.COINBASE_COMMERCE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }
  const payload = JSON.parse(raw) as { id?: string; event?: { id?: string; type?: string; data?: { id?: string; metadata?: { order_id?: string } } } };
  const type = payload.event?.type ?? "";
  const next = type === "charge:confirmed" ? "success" : type === "charge:failed" ? "failed" : type === "charge:pending" ? "processing" : "pending";
  const result = await applyProviderStatus({
    provider: "coinbase", eventId: String(payload.event?.id ?? payload.id),
    providerPaymentId: payload.event?.data?.id ?? null, orderId: payload.event?.data?.metadata?.order_id ?? null,
    nextStatus: next, raw: payload as unknown as Record<string, unknown>,
  });
  return NextResponse.json({ ok: true, ...result });
}
