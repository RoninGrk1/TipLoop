import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
export const metadata = { title: "Terms" };
export default function TermsPage() {
  return (<div><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-3xl font-semibold">Terms of Service</h1><p className="mt-4 text-sm leading-7 text-[var(--muted)]">TipLoop is software that helps creators accept cryptocurrency tips through third-party processors. These terms are a template and must be reviewed by counsel before public launch.</p></main><SiteFooter /></div>);
}
