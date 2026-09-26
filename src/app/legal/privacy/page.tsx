import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (<div><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-3xl font-semibold">Privacy Policy</h1><p className="mt-4 text-sm leading-7 text-[var(--muted)]">We collect account email, profile fields, payment metadata required to reconcile tips, and IP addresses for rate limiting. TipLoop does not store seed phrases or private keys.</p></main><SiteFooter /></div>);
}
