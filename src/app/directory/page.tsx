import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export default function DirectoryPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Creator directory</h1>
        <p className="mt-2 text-[var(--muted)]">Public pages appear here after Supabase is connected and creators register.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
