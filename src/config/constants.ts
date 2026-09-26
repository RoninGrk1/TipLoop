export const APP_NAME = "TipLoop";
export const APP_TAGLINE = "Creators deserve the world.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/** Authoritative platform fee. Never recompute this in the browser for settlement. */
export const PLATFORM_FEE_BPS = 200; // 2.00%
export const PLATFORM_FEE_PERCENT = PLATFORM_FEE_BPS / 100;

export const MIN_TIP_USD_CENTS = 100; // $1.00
export const MAX_TIP_USD_CENTS = 1_000_000; // $10,000.00
export const DEFAULT_TIP_PRESETS_USD = [3, 5, 10, 25, 50] as const;

export const PAYMENT_TTL_MINUTES = 30;

export const HANDLE_MIN = 3;
export const HANDLE_MAX = 24;
export const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){1,22}[a-z0-9]$/;

export const SUPPORTED_ASSETS = [
  { code: "BTC", name: "Bitcoin", networks: ["bitcoin"] },
  { code: "ETH", name: "Ethereum", networks: ["ethereum"] },
  { code: "SOL", name: "Solana", networks: ["solana"] },
  { code: "USDC", name: "USD Coin", networks: ["ethereum", "solana", "polygon"] },
  { code: "USDT", name: "Tether", networks: ["ethereum", "tron", "polygon"] },
  { code: "LTC", name: "Litecoin", networks: ["litecoin"] },
] as const;

export type AssetCode = (typeof SUPPORTED_ASSETS)[number]["code"];

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "success",
  "failed",
  "expired",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
