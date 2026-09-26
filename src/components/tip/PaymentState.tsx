import Link from "next/link";
import type { PaymentStatus } from "@/config/constants";
const copy: Record<PaymentStatus, { title: string; body: string }> = {
  pending: { title: "Waiting for payment", body: "Complete checkout with the payment provider. This page will not mark the tip successful on its own." },
  processing: { title: "Confirming on-chain", body: "The provider has seen a payment and is waiting for confirmations." },
  success: { title: "Tip received", body: "The provider webhook confirmed this payment. Thank you for supporting a creator." },
  failed: { title: "Payment failed", body: "The provider reported a failed or cancelled checkout. No platform fee was taken." },
  expired: { title: "Payment expired", body: "This invoice passed its time window. Start a new tip if you still want to support this creator." },
  refunded: { title: "Payment refunded", body: "This tip was refunded. Ledger entries record the reversal." },
};
export function PaymentStateView({ status, handle, paymentId, extra }: { status: PaymentStatus; handle: string; paymentId?: string; extra?: string }) {
  const c = copy[status];
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">{status}</p>
      <h1 className="mt-3 text-3xl font-semibold">{c.title}</h1>
      <p className="mt-4 text-[var(--muted)]">{c.body}</p>
      {extra ? <p className="mt-3 text-sm text-amber-200">{extra}</p> : null}
      {paymentId ? <p className="mt-4 font-mono text-xs text-white/40">{paymentId}</p> : null}
      <div className="mt-8 flex flex-col gap-3">
        <Link href={`/c/${handle}`} className="rounded-full bg-white px-5 py-3 text-black">Back to @{handle}</Link>
        {status === "success" ? <Link href="/signup" className="rounded-full border border-white/20 px-5 py-3">Create your own tip page</Link> : null}
      </div>
    </main>
  );
}
