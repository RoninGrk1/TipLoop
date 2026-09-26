import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionProfile } from "@/lib/auth/session";
export const dynamic = "force-dynamic";
export default async function PayoutsPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login?next=/dashboard/payouts");
  return (<div><SiteHeader /><main className="mx-auto max-w-xl px-4 py-10"><h1 className="text-3xl font-semibold">Payouts</h1><p className="mt-3 text-[var(--muted)]">Tips settle to the asset/network selected at checkout. Add your receiving address in Settings. Automatic split payouts require NOWPayments payout API + KYC.</p></main></div>);
}
