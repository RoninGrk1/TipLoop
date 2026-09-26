import { APP_URL, PAYMENT_TTL_MINUTES } from "@/config/constants";
import type { FeeBreakdown } from "@/lib/payments/fees";
import { hmacSha512Hex, safeEqualHex } from "@/lib/security/crypto";

export type CreateChargeInput = {
  paymentId: string;
  idempotencyKey: string;
  handle: string;
  asset: string;
  network: string;
  breakdown: FeeBreakdown;
  supporterEmail?: string | null;
  description: string;
};

export type ProviderCharge = {
  provider: "nowpayments" | "coinbase" | "disabled";
  providerPaymentId: string | null;
  checkoutUrl: string | null;
  qrPayload: string | null;
  cryptoAmount: string | null;
  raw: Record<string, unknown>;
};

export type ProviderEvent = {
  provider: string;
  eventId: string;
  providerPaymentId: string;
  status: "pending" | "processing" | "success" | "failed" | "expired" | "refunded";
  cryptoAmount?: string;
  raw: Record<string, unknown>;
};

export function paymentsLiveEnabled() {
  return process.env.PAYMENTS_ENABLED === "true" && Boolean(process.env.NOWPAYMENTS_API_KEY) && Boolean(process.env.NOWPAYMENTS_IPN_SECRET);
}

export function paymentsDisabledReason() {
  const missing: string[] = [];
  if (process.env.PAYMENTS_ENABLED !== "true") missing.push("PAYMENTS_ENABLED=true");
  if (!process.env.NOWPAYMENTS_API_KEY) missing.push("NOWPAYMENTS_API_KEY");
  if (!process.env.NOWPAYMENTS_IPN_SECRET) missing.push("NOWPAYMENTS_IPN_SECRET");
  if (!process.env.NOWPAYMENTS_IPN_CALLBACK_URL) missing.push("NOWPAYMENTS_IPN_CALLBACK_URL");
  return missing.length ? `Live crypto checkout is disabled. Missing: ${missing.join(", ")}.` : "Live crypto checkout is disabled by operator policy.";
}

export async function createProviderCharge(input: CreateChargeInput): Promise<ProviderCharge> {
  if (!paymentsLiveEnabled()) {
    return { provider: "disabled", providerPaymentId: null, checkoutUrl: null, qrPayload: null, cryptoAmount: null, raw: { disabled: true, reason: paymentsDisabledReason() } };
  }
  const apiKey = process.env.NOWPAYMENTS_API_KEY!;
  const callbackUrl = process.env.NOWPAYMENTS_IPN_CALLBACK_URL ?? `${APP_URL}/api/webhooks/nowpayments`;
  const successUrl = `${APP_URL}/c/${input.handle}/success?payment=${input.paymentId}`;
  const cancelUrl = `${APP_URL}/c/${input.handle}/failed?payment=${input.paymentId}`;
  const body = {
    price_amount: input.breakdown.grossCents / 100,
    price_currency: "usd",
    pay_currency: input.asset.toLowerCase(),
    ipn_callback_url: callbackUrl,
    order_id: input.paymentId,
    order_description: input.description,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };
  const response = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NOWPayments invoice failed (${response.status}): ${text.slice(0, 500)}`);
  }
  const json = (await response.json()) as { id?: string | number; invoice_url?: string };
  return { provider: "nowpayments", providerPaymentId: json.id != null ? String(json.id) : null, checkoutUrl: json.invoice_url ?? null, qrPayload: json.invoice_url ?? null, cryptoAmount: null, raw: json as Record<string, unknown> };
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).sort().reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = sortKeys((value as Record<string, unknown>)[key]);
      return acc;
    }, {});
  }
  return value;
}

export function verifyNowPaymentsSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !signatureHeader) return false;
  let parsed: unknown;
  try { parsed = JSON.parse(rawBody); } catch { return false; }
  const expected = hmacSha512Hex(secret, JSON.stringify(sortKeys(parsed)));
  return safeEqualHex(expected, signatureHeader.toLowerCase());
}

export function signNowPaymentsFixture(secret: string, payload: Record<string, unknown>) {
  return hmacSha512Hex(secret, JSON.stringify(sortKeys(payload)));
}

export function mapNowPaymentsStatus(status: string): ProviderEvent["status"] {
  switch (status) {
    case "waiting":
    case "confirming":
      return "processing";
    case "confirmed":
    case "sending":
    case "finished":
      return "success";
    case "failed":
      return "failed";
    case "refunded":
      return "refunded";
    case "expired":
      return "expired";
    case "partially_paid":
      return "processing";
    default:
      return "pending";
  }
}

export function invoiceExpiryIso(from = new Date()) {
  return new Date(from.getTime() + PAYMENT_TTL_MINUTES * 60_000).toISOString();
}
