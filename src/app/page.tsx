import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Logo } from "@/components/brand/Logo";
import { PLATFORM_FEE_PERCENT } from "@/config/constants";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center"><Logo size={72} /></div>
          <p className="mb-3 text-sm uppercase tracking-[0.28em] text-cyan-300/80">Crypto tipping for creators</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            <span className="chrome-text">Creators deserve the world.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[var(--muted)] sm:text-lg">
            A public tip page, a shareable QR code, and a real crypto checkout. TipLoop keeps a transparent {PLATFORM_FEE_PERCENT.toFixed(0)}% platform fee — calculated on the server, never faked in the browser.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="focus-ring w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 px-6 py-3 text-center font-medium text-white sm:w-auto">Create your tip page</Link>
            <Link href="/directory" className="focus-ring w-full rounded-full border border-white/15 px-6 py-3 text-center text-sm text-white/90 sm:w-auto">Browse creators</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
