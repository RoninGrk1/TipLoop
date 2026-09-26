"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_TIP_PRESETS_USD, PLATFORM_FEE_BPS, SUPPORTED_ASSETS } from "@/config/constants";

export function TipForm({ handle, preferredAsset, preferredNetwork }: { handle: string; preferredAsset: string; preferredNetwork: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(5);
  const [asset, setAsset] = useState(preferredAsset);
  const [network, setNetwork] = useState(preferredNetwork);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const networks = useMemo(() => SUPPORTED_ASSETS.find((a) => a.code === asset)?.networks ?? [preferredNetwork], [asset, preferredNetwork]);
  const estimateFee = Math.floor(Math.round(amount * 100) * PLATFORM_FEE_BPS / 10_000);
  const estimateNet = Math.round(amount * 100) - estimateFee;
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const res = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle, amountUsd: amount, asset, network, supporterName: name, supporterEmail: email, message }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not start checkout.");
      if (json.live && json.checkoutUrl) { window.location.href = json.checkoutUrl; return; }
      router.push(`/c/${handle}/pending?payment=${json.paymentId}&reason=disabled`);
    } catch (err) { setError(err instanceof Error ? err.message : "Checkout failed."); setBusy(false); }
  }
  return (
    <form onSubmit={onSubmit} className="glass space-y-5 rounded-3xl p-5 sm:p-6">
      <div>
        <p className="text-sm text-[var(--muted)]">Tip amount (USD)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEFAULT_TIP_PRESETS_USD.map((p) => (
            <button type="button" key={p} onClick={() => setAmount(p)} className={`focus-ring rounded-full px-3 py-1.5 text-sm ${amount === p ? "bg-white text-black" : "bg-white/10"}`}>${p}</button>
          ))}
        </div>
        <input type="number" min={1} max={10000} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="focus-ring mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" aria-label="Custom USD amount" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Asset<select className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3" value={asset} onChange={(e) => { setAsset(e.target.value); const next = SUPPORTED_ASSETS.find((a) => a.code === e.target.value); if (next) setNetwork(next.networks[0]); }}>{SUPPORTED_ASSETS.map((a) => <option key={a.code} value={a.code}>{a.code}</option>)}</select></label>
        <label className="text-sm">Network<select className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3" value={network} onChange={(e) => setNetwork(e.target.value)}>{networks.map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      <label className="block text-sm">Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" /></label>
      <label className="block text-sm">Email (optional)<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" /></label>
      <label className="block text-sm">Message (optional)<textarea value={message} maxLength={280} onChange={(e) => setMessage(e.target.value)} className="focus-ring mt-1 min-h-20 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" /></label>
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm">
        <p>Estimated 2.00% platform fee: ${(estimateFee / 100).toFixed(2)}</p>
        <p className="text-[var(--muted)]">Creator net (estimate): ${(estimateNet / 100).toFixed(2)}. Final fee is calculated on the server at checkout.</p>
      </div>
      {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
      <button type="submit" disabled={busy} className="focus-ring w-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 py-3 font-medium disabled:opacity-60">{busy ? "Starting checkout…" : `Send $${amount.toFixed(2)} in ${asset}`}</button>
    </form>
  );
}
