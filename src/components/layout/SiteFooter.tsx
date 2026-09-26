import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo size={28} withWord />
          <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">Creators deserve the world. Crypto tips with a transparent 2% platform fee.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-[var(--muted)]">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/refunds">Refunds</Link>
          <Link href="/legal/fees">Fee disclosure</Link>
          <Link href="/legal/risks">Crypto risks</Link>
          <Link href="/directory">Directory</Link>
        </div>
      </div>
    </footer>
  );
}
