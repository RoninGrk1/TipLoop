import { z } from "zod";
import { HANDLE_MAX, HANDLE_MIN, HANDLE_PATTERN, MAX_TIP_USD_CENTS, MIN_TIP_USD_CENTS, SUPPORTED_ASSETS } from "@/config/constants";
const assetCodes = SUPPORTED_ASSETS.map((a) => a.code) as [string, ...string[]];
export const handleSchema = z.string().min(HANDLE_MIN).max(HANDLE_MAX).regex(HANDLE_PATTERN, "Use lowercase letters, numbers, and single hyphens.");
export const createPaymentSchema = z.object({
  handle: handleSchema, amountUsd: z.number().positive(), asset: z.enum(assetCodes), network: z.string().min(2).max(32),
  supporterName: z.string().trim().max(80).optional().or(z.literal("")),
  supporterEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().trim().max(280).optional().or(z.literal("")),
});
export const profileUpdateSchema = z.object({
  handle: handleSchema.optional(), display_name: z.string().trim().min(1).max(60),
  bio: z.string().trim().max(280).optional().or(z.literal("")), website: z.string().url().optional().or(z.literal("")),
  preferred_asset: z.enum(assetCodes), preferred_network: z.string().min(2).max(32),
  payout_address: z.string().trim().min(8).max(128).optional().or(z.literal("")), is_public: z.boolean(),
});
export function assertSupportedPair(asset: string, network: string) {
  const found = SUPPORTED_ASSETS.find((a) => a.code === asset);
  if (!found) throw new Error("Unsupported asset.");
  if (!(found.networks as readonly string[]).includes(network)) throw new Error(`${asset} is not enabled on ${network}.`);
}
export function assertAmountCents(cents: number) {
  if (cents < MIN_TIP_USD_CENTS || cents > MAX_TIP_USD_CENTS) throw new Error("Tip amount is outside allowed bounds.");
}
