import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function OnboardingPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login?next=/onboarding");
  return (<div><SiteHeader /><main className="mx-auto max-w-xl px-4 py-16"><h1 className="text-3xl font-semibold">Your page is ready</h1><p className="mt-3 text-[var(--muted)]">Customise your profile, add a payout address, then share your unique link or QR code.</p><div className="mt-8 flex flex-col gap-3"><Link href="/dashboard/settings" className="rounded-full bg-white px-5 py-3 text-center text-black">Customise profile</Link><Link href="/dashboard" className="rounded-full border border-white/20 px-5 py-3 text-center">Open dashboard</Link></div></main></div>);
}
