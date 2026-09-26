import { PLATFORM_FEE_BPS } from "@/config/constants";
import { calculatePlatformFee, parseUsdToCents } from "@/lib/payments/fees";
import {
  createProviderCharge,
  invoiceExpiryIso,
  mapNowPaymentsStatus,
  paymentsDisabledReason,
  paymentsLiveEnabled,
} from "@/lib/payments/provider";
import { assertTransition } from "@/lib/payments/state-machine";
import { createServiceSupabase } from "@/lib/db/supabase";
import { newIdempotencyKey } from "@/lib/security/crypto";
import { assertAmountCents, assertSupportedPair } from "@/lib/validators";
import type { Payment } from "@/types";
import type { PaymentStatus as Status } from "@/config/constants";

export async function getPublicProfileByHandle(handle: string) {
  const db = createServiceSupabase();
  const { data, error } = await db
    .from("profiles")
    .select("id, handle, display_name, bio, avatar_url, banner_url, website, socials, theme, is_public, is_verified, preferred_asset, preferred_network, referral_code")
    .eq("handle", handle.toLowerCase())
    .eq("is_public", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTipPayment(input: {
  handle: string; amountUsd: number; asset: string; network: string;
  supporterName?: string; supporterEmail?: string; message?: string;
}): Promise<{ payment: Payment; live: boolean; disabledReason?: string }> {
  assertSupportedPair(input.asset, input.network);
  const grossCents = parseUsdToCents(input.amountUsd);
  assertAmountCents(grossCents);
  const breakdown = calculatePlatformFee(grossCents, PLATFORM_FEE_BPS);
  const profile = await getPublicProfileByHandle(input.handle);
  if (!profile) throw new Error("Creator not found.");
  const live = paymentsLiveEnabled();
  const id = crypto.randomUUID();
  const idempotencyKey = newIdempotencyKey();
  const charge = await createProviderCharge({
    paymentId: id, idempotencyKey, handle: profile.handle, asset: input.asset, network: input.network,
    breakdown, supporterEmail: input.supporterEmail, description: `TipLoop tip to @${profile.handle}`,
  });
  const row = {
    id, creator_id: profile.id, handle: profile.handle,
    supporter_name: input.supporterName || null, supporter_email: input.supporterEmail || null, message: input.message || null,
    asset: input.asset, network: input.network,
    gross_cents: breakdown.grossCents, fee_cents: breakdown.feeCents, net_cents: breakdown.netCents, fee_bps: breakdown.feeBps,
    crypto_amount: charge.cryptoAmount, status: "pending" as Status, provider: charge.provider,
    provider_payment_id: charge.providerPaymentId, idempotency_key: idempotencyKey,
    checkout_url: charge.checkoutUrl, qr_payload: charge.qrPayload, expires_at: invoiceExpiryIso(),
    metadata: { fee_disclosure: `TipLoop collects a ${breakdown.feePercentLabel} platform fee on successful tips.`, live },
  };
  const db = createServiceSupabase();
  const { data, error } = await db.from("payments").insert(row).select("*").single();
  if (error) throw error;
  return { payment: data as Payment, live, disabledReason: live ? undefined : paymentsDisabledReason() };
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const db = createServiceSupabase();
  const { data, error } = await db.from("payments").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Payment | null) ?? null;
}

async function writeLedger(paymentId: string, gross: number, fee: number, net: number) {
  const db = createServiceSupabase();
  const { error } = await db.from("ledger_entries").insert([
    { payment_id: paymentId, entry_type: "tip_gross", amount_cents: gross },
    { payment_id: paymentId, entry_type: "platform_fee", amount_cents: fee },
    { payment_id: paymentId, entry_type: "creator_net", amount_cents: net },
  ]);
  if (error) throw error;
}

export async function applyProviderStatus(opts: {
  provider: string; eventId: string; providerPaymentId?: string | null; orderId?: string | null;
  nextStatus: Status; cryptoAmount?: string; raw: Record<string, unknown>;
}): Promise<{ applied: boolean; paymentId?: string; reason?: string }> {
  const db = createServiceSupabase();
  const { data: existingEvent } = await db.from("webhook_events").select("id, status").eq("provider", opts.provider).eq("event_id", opts.eventId).maybeSingle();
  if (existingEvent?.status === "processed") return { applied: false, reason: "duplicate_event" };
  const { error: insertErr } = await db.from("webhook_events").upsert(
    { provider: opts.provider, event_id: opts.eventId, status: "received", payload: opts.raw },
    { onConflict: "provider,event_id", ignoreDuplicates: true },
  );
  if (insertErr && insertErr.code !== "23505") throw insertErr;
  let payment: Payment | null = null;
  if (opts.orderId) payment = await getPaymentById(opts.orderId);
  if (!payment && opts.providerPaymentId) {
    const { data } = await db.from("payments").select("*").eq("provider", opts.provider).eq("provider_payment_id", opts.providerPaymentId).maybeSingle();
    payment = (data as Payment | null) ?? null;
  }
  if (!payment) {
    await db.from("webhook_events").update({ status: "ignored", error: "payment_not_found", processed_at: new Date().toISOString() }).eq("provider", opts.provider).eq("event_id", opts.eventId);
    return { applied: false, reason: "payment_not_found" };
  }
  try { assertTransition(payment.status as Status, opts.nextStatus); }
  catch (err) {
    await db.from("webhook_events").update({ status: "ignored", payment_id: payment.id, error: (err as Error).message, processed_at: new Date().toISOString() }).eq("provider", opts.provider).eq("event_id", opts.eventId);
    return { applied: false, paymentId: payment.id, reason: "illegal_transition" };
  }
  const patch: Record<string, unknown> = { status: opts.nextStatus, crypto_amount: opts.cryptoAmount ?? payment.crypto_amount };
  if (opts.nextStatus === "success") patch.paid_at = new Date().toISOString();
  if (opts.nextStatus === "refunded") patch.refunded_at = new Date().toISOString();
  if (opts.nextStatus === "failed") patch.failure_reason = "provider_failed";
  const { error: updErr } = await db.from("payments").update(patch).eq("id", payment.id);
  if (updErr) throw updErr;
  if (opts.nextStatus === "success" && payment.status !== "success") await writeLedger(payment.id, payment.gross_cents, payment.fee_cents, payment.net_cents);
  if (opts.nextStatus === "refunded" && payment.status === "success") {
    await db.from("ledger_entries").insert({ payment_id: payment.id, entry_type: "refund", amount_cents: -payment.gross_cents });
  }
  await db.from("webhook_events").update({ status: "processed", payment_id: payment.id, processed_at: new Date().toISOString() }).eq("provider", opts.provider).eq("event_id", opts.eventId);
  return { applied: true, paymentId: payment.id };
}

export function nowPaymentsToStatus(payload: Record<string, unknown>): Status {
  return mapNowPaymentsStatus(String(payload.payment_status ?? payload.status ?? "waiting"));
}

export async function expireStalePayments(): Promise<number> {
  const db = createServiceSupabase();
  const { data, error } = await db.from("payments").update({ status: "expired" }).in("status", ["pending", "processing"]).lt("expires_at", new Date().toISOString()).select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function requestRefund(paymentId: string, actorId: string) {
  const payment = await getPaymentById(paymentId);
  if (!payment) throw new Error("Payment not found.");
  if (payment.creator_id !== actorId) throw new Error("Forbidden.");
  if (payment.status !== "success") throw new Error("Only successful tips can be refunded.");
  if (!paymentsLiveEnabled()) throw new Error("Live provider refunds are unavailable until payments are enabled.");
  throw new Error("Provider refunds require NOWPayments refund API credentials and the original payer address. See docs/PAYMENTS.md.");
}
