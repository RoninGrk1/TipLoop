import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionProfile } from "@/lib/auth/session";
export const dynamic = "force-dynamic";
export default async function ReferralsPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login?next=/dashboard/referrals");
  return (<div><SiteHeader /><main className="mx-auto max-w-xl px-4 py-10"><h1 className="text-3xl font-semibold">Referral loop</h1><p className="mt-3 text-[var(--muted)]">Share your referral code when a supporter creates their own page after tipping.</p><div className="glass mt-6 rounded-3xl p-6"><p className="text-sm text-[var(--muted)]">Your code</p><p className="mt-2 font-mono text-2xl">{session.profile?.referral_code ?? "—"}</p></div></main></div>);
}
