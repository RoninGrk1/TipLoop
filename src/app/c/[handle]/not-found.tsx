import Link from "next/link";
export default function CreatorNotFound() {
  return (<main className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="text-3xl font-semibold">Creator not found</h1><p className="mt-3 text-[var(--muted)]">That handle is not public or does not exist.</p><Link href="/directory" className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-black">Browse creators</Link></main>);
}
