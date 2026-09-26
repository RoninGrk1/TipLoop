"use client";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SUPPORTED_ASSETS } from "@/config/constants";
export default function SettingsPage() {
  const [form, setForm] = useState({ handle: "", display_name: "", bio: "", website: "", preferred_asset: "USDC", preferred_network: "solana", payout_address: "", is_public: true });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { fetch("/api/profile").then((r) => r.json()).then((j) => { if (j.profile) setForm((f) => ({ ...f, ...j.profile, bio: j.profile.bio ?? "", website: j.profile.website ?? "", payout_address: j.profile.payout_address ?? "" })); }).catch(() => setErr("Could not load profile.")); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setErr(null);
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = await res.json();
    if (!res.ok) setErr(JSON.stringify(json.error)); else setMsg("Saved.");
  }
  return (<div><SiteHeader /><main className="mx-auto max-w-xl px-4 py-10"><h1 className="text-3xl font-semibold">Profile</h1>
    <form onSubmit={save} className="glass mt-6 space-y-4 rounded-3xl p-6">
      {(["handle","display_name","bio","website","payout_address"] as const).map((key) => (<label key={key} className="block text-sm capitalize">{key.replace("_"," ")}<input value={String(form[key] ?? "")} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3" /></label>))}
      <label className="block text-sm">Preferred asset<select value={form.preferred_asset} onChange={(e) => { const asset = e.target.value; const net = SUPPORTED_ASSETS.find((a) => a.code === asset)?.networks[0] ?? "solana"; setForm({ ...form, preferred_asset: asset, preferred_network: net }); }} className="focus-ring mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3">{SUPPORTED_ASSETS.map((a) => <option key={a.code}>{a.code}</option>)}</select></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} /> Public directory listing</label>
      <button className="focus-ring w-full rounded-full bg-white py-3 text-black">Save</button>
      {msg ? <p className="text-emerald-300">{msg}</p> : null}{err ? <p className="text-rose-300">{err}</p> : null}
    </form></main></div>);
}
