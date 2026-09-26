import type { PaymentStatus } from "@/config/constants";
export type Json = Record<string, unknown>;
export type Profile = {
  id: string; handle: string; display_name: string; bio: string | null;
  avatar_url: string | null; banner_url: string | null; website: string | null;
  socials: { x?: string; youtube?: string; twitch?: string; instagram?: string; website?: string };
  theme: { accent?: string; preset?: "aurora" | "chrome" | "violet" };
  is_public: boolean; is_verified: boolean; referral_code: string; referred_by: string | null;
  preferred_asset: string; preferred_network: string; payout_address: string | null;
  created_at: string; updated_at: string;
};
export type Payment = {
  id: string; creator_id: string; handle: string; supporter_name: string | null; supporter_email: string | null;
  message: string | null; asset: string; network: string; gross_cents: number; fee_cents: number; net_cents: number;
  fee_bps: number; crypto_amount: string | null; status: PaymentStatus; provider: string;
  provider_payment_id: string | null; idempotency_key: string; checkout_url: string | null; qr_payload: string | null;
  expires_at: string; paid_at: string | null; refunded_at: string | null; failure_reason: string | null;
  metadata: Json; created_at: string; updated_at: string;
};
