import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export const metadata = { title: "Refunds" };
export default function RefundsPage() {
  return (<div><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-3xl font-semibold">Refund Policy</h1><p className="mt-4 text-sm leading-7 text-[var(--muted)]">Cryptocurrency transfers are generally irreversible. TipLoop only marks a payment refunded after the processor confirms a refund.</p></main><SiteFooter /></div>);
}
