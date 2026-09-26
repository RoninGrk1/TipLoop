import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05060a]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="focus-ring rounded-lg" aria-label="TipLoop home"><Logo size={32} withWord /></Link>
        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] sm:flex">
          <Link href="/directory" className="focus-ring rounded hover:text-white">Creators</Link>
          <Link href="/legal/fees" className="focus-ring rounded hover:text-white">Fees</Link>
        </nav>
        {cta ? (
          <div className="flex items-center gap-2">
            <Link href="/login" className="focus-ring hidden rounded-full px-3 py-1.5 text-sm text-[var(--muted)] hover:text-white sm:inline">Sign in</Link>
            <Link href="/signup" className="focus-ring rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white">Create tip page</Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
