import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionProfile } from "@/lib/auth/session";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { usdFromCents } from "@/lib/payments/fees";
import { APP_URL } from "@/config/constants";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login?next=/dashboard");
  const profile = session.profile;
  let payments: Array<{ id: string; status: string; gross_cents: number; fee_cents: number; net_cents: number; asset: string; created_at: string; supporter_name: string | null }> = [];
  if (isSupabaseConfigured()) {
    const db = await createServerSupabase();
    const { data } = await db.from("payments").select("id, status, gross_cents, fee_cents, net_cents, asset, created_at, supporter_name").eq("creator_id", session.userId).order("created_at", { ascending: false }).limit(50);
    payments = data ?? [];
  }
  const successful = payments.filter((p) => p.status === "success");
  const gross = successful.reduce((s, p) => s + p.gross_cents, 0);
  const fees = successful.reduce((s, p) => s + p.fee_cents, 0);
  const net = successful.reduce((s, p) => s + p.net_cents, 0);
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-semibold">Dashboard</h1><p className="text-[var(--muted)]">{profile ? `@${profile.handle}` : "Finish onboarding to claim a handle."}</p></div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link className="rounded-full border border-white/15 px-4 py-2" href="/dashboard/settings">Settings</Link>
            <Link className="rounded-full border border-white/15 px-4 py-2" href="/dashboard/analytics">Analytics</Link>
            <Link className="rounded-full border border-white/15 px-4 py-2" href="/dashboard/referrals">Referrals</Link>
            {profile ? <Link className="rounded-full bg-white px-4 py-2 text-black" href={`/c/${profile.handle}`}>Public page</Link> : null}
          </div>
        </div>
        {profile ? <p className="mt-4 text-sm text-cyan-200">Share {APP_URL}/c/{profile.handle}</p> : null}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["Gross (success)", gross],["Platform fee", fees],["Your net", net]].map(([label, cents]) => (
            <article key={String(label)} className="glass rounded-3xl p-5"><p className="text-sm text-[var(--muted)]">{label}</p><p className="mt-2 text-2xl font-semibold">${usdFromCents(Number(cents))}</p></article>
          ))}
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-medium">Recent tips</h2>
          {payments.length === 0 ? <p className="mt-4 text-sm text-[var(--muted)]">No tips yet. Share your page.</p> : (
            <ul className="mt-4 space-y-2 text-sm">{payments.map((p) => <li key={p.id} className="flex justify-between border-t border-white/10 py-3"><span>{p.supporter_name || "Anonymous"} · {p.asset} · {p.status}</span><span>${usdFromCents(p.gross_cents)}</span></li>)}</ul>
          )}
        </section>
      </main>
    </div>
  );
}
