import {
  MAX_TIP_USD_CENTS,
  MIN_TIP_USD_CENTS,
  PLATFORM_FEE_BPS,
} from "@/config/constants";

export type FeeBreakdown = {
  grossCents: number;
  feeCents: number;
  netCents: number;
  feeBps: number;
  feePercentLabel: string;
  currency: "USD";
};

export class FeeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeeError";
  }
}

/**
 * Server-authoritative fee math using integer cents.
 * Floor the fee so creators are never underpaid by rounding-up.
 * 2% of $5.00 = 10 cents; $4.90 net.
 */
export function calculatePlatformFee(
  grossCents: number,
  feeBps: number = PLATFORM_FEE_BPS,
): FeeBreakdown {
  if (!Number.isInteger(grossCents) || !Number.isInteger(feeBps)) {
    throw new FeeError("Amounts and basis points must be integers.");
  }
  if (grossCents < MIN_TIP_USD_CENTS) {
    throw new FeeError(`Minimum tip is ${MIN_TIP_USD_CENTS / 100} USD.`);
  }
  if (grossCents > MAX_TIP_USD_CENTS) {
    throw new FeeError(`Maximum tip is ${MAX_TIP_USD_CENTS / 100} USD.`);
  }
  if (feeBps < 0 || feeBps > 10_000) {
    throw new FeeError("Fee basis points out of range.");
  }

  const feeCents = Math.floor((grossCents * feeBps) / 10_000);
  const netCents = grossCents - feeCents;

  if (netCents <= 0) {
    throw new FeeError("Net payout must be greater than zero.");
  }

  return {
    grossCents,
    feeCents,
    netCents,
    feeBps,
    feePercentLabel: `${(feeBps / 100).toFixed(2)}%`,
    currency: "USD",
  };
}

export function usdFromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function parseUsdToCents(input: string | number): number {
  const n = typeof input === "number" ? input : Number.parseFloat(input);
  if (!Number.isFinite(n)) {
    throw new FeeError("Invalid USD amount.");
  }
  return Math.round(n * 100);
}
