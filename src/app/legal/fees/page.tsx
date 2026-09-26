import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export const metadata = { title: "Fee disclosure" };
export default function FeesPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Fee disclosure</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">TipLoop charges a 2.00% platform fee on eligible successful tips. fee_cents = floor(gross_cents × 200 / 10_000). Browser estimates are informational only.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
