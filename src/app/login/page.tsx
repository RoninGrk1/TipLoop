"use client";
import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { createBrowserSupabase } from "@/lib/db/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Authentication is disabled until Supabase keys are configured.");
      const supabase = createBrowserSupabase();
      const { error: err } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (err) throw err;
      setMessage("Check your email for the sign-in link.");
    } catch (err) { setError(err instanceof Error ? err.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }
  return (
    <div>
      <SiteHeader cta={false} />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <form onSubmit={onSubmit} className="glass mt-6 space-y-4 rounded-3xl p-6">
          <label className="block text-sm">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" /></label>
          <button disabled={busy} className="focus-ring w-full rounded-full bg-white py-3 text-black">{busy ? "Sending…" : "Send magic link"}</button>
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>
        <p className="mt-4 text-sm text-[var(--muted)]">New here? <Link href="/signup">Create a tip page</Link></p>
      </main>
    </div>
  );
}
