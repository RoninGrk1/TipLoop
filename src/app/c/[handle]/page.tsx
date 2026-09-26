import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TipForm } from "@/components/tip/TipForm";
import { getPublicProfileByHandle } from "@/lib/payments/service";
import { isSupabaseConfigured } from "@/lib/db/supabase";
import { APP_URL } from "@/config/constants";
export const dynamic = "force-dynamic";
export default async function CreatorPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!isSupabaseConfigured()) {
    return (<div><SiteHeader /><main className="mx-auto max-w-lg px-4 py-16 text-center"><h1 className="text-2xl font-semibold">@{handle}</h1><p className="mt-4 text-[var(--muted)]">This tip page will go live after Supabase is connected. Live crypto checkout stays disabled until provider credentials are present.</p></main></div>);
  }
  let profile;
  try { profile = await getPublicProfileByHandle(handle); } catch { profile = null; }
  if (!profile) notFound();
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="glass overflow-hidden rounded-3xl">
          <div className="h-28 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-400" />
          <div className="px-6 pb-6">
            <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b0d14] text-2xl font-semibold">{profile.display_name.slice(0, 1).toUpperCase()}</div>
            <h1 className="mt-4 text-2xl font-semibold">{profile.display_name}</h1>
            <p className="text-cyan-300">@{profile.handle}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{profile.bio || "Send a crypto tip. Creators deserve the world."}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a className="underline decoration-white/20" href={`${APP_URL}/c/${profile.handle}`}>Copy link</a>
              <Link href={`/api/qr?handle=${profile.handle}`} className="underline decoration-white/20">QR code</Link>
            </div>
          </div>
        </section>
        <TipForm handle={profile.handle} preferredAsset={profile.preferred_asset} preferredNetwork={profile.preferred_network} />
      </main>
    </div>
  );
}
