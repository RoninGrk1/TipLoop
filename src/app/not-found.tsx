import Link from "next/link";
export default function NotFound() {
  return (<main className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-3xl font-semibold">Page not found</h1><p className="mt-3 text-[var(--muted)]">That tip page or route does not exist.</p><Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-black">Home</Link></main>);
}
