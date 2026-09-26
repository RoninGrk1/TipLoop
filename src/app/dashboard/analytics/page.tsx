import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionProfile } from "@/lib/auth/session";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/db/supabase";
import { usdFromCents } from "@/lib/payments/fees";
export const dynamic = "force-dynamic";
export default async function AnalyticsPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login?next=/dashboard/analytics");
  const counts: Record<string, number> = { pending: 0, processing: 0, success: 0, failed: 0, expired: 0, refunded: 0 };
  let net = 0;
  if (isSupabaseConfigured()) {
    const db = await createServerSupabase();
    const { data } = await db.from("payments").select("status, net_cents").eq("creator_id", session.userId);
    for (const row of data ?? []) { counts[row.status] = (counts[row.status] ?? 0) + 1; if (row.status === "success") net += row.net_cents; }
  }
  return (<div><SiteHeader /><main className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-semibold">Analytics</h1><p className="mt-2 text-[var(--muted)]">Successful net: ${usdFromCents(net)}</p><ul className="mt-8 grid gap-3 sm:grid-cols-3">{Object.entries(counts).map(([k,v]) => <li key={k} className="glass rounded-3xl p-5"><p className="capitalize text-[var(--muted)]">{k}</p><p className="mt-2 text-2xl">{v}</p></li>)}</ul></main></div>);
}
