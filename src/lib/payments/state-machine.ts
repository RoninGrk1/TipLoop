import type { PaymentStatus } from "@/config/constants";

const ALLOWED: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["processing", "success", "failed", "expired"],
  processing: ["success", "failed", "expired"],
  success: ["refunded"],
  failed: [],
  expired: [],
  refunded: [],
};

export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return true;
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: PaymentStatus, to: PaymentStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal payment transition: ${from} → ${to}`);
  }
}
