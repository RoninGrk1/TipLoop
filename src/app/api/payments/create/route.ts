import { NextResponse } from "next/server";
import { createTipPayment } from "@/lib/payments/service";
import { createPaymentSchema } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { isSupabaseConfigured } from "@/lib/db/supabase";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const rl = rateLimit(`pay:${ip}`, 8, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many payment attempts." }, { status: 429 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured.", requirements: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"] }, { status: 503 });
  }
  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = createPaymentSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid tip request.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const result = await createTipPayment({
      handle: parsed.data.handle, amountUsd: parsed.data.amountUsd, asset: parsed.data.asset, network: parsed.data.network,
      supporterName: parsed.data.supporterName || undefined, supporterEmail: parsed.data.supporterEmail || undefined, message: parsed.data.message || undefined,
    });
    return NextResponse.json({
      paymentId: result.payment.id, status: result.payment.status, live: result.live, checkoutUrl: result.payment.checkout_url, disabledReason: result.disabledReason,
      fee: { grossCents: result.payment.gross_cents, feeCents: result.payment.fee_cents, netCents: result.payment.net_cents, feeBps: result.payment.fee_bps, disclosure: "TipLoop collects a 2.00% platform fee on eligible successful tips. Fees are calculated on the server." },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Payment creation failed." }, { status: 400 });
  }
}
