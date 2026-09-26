# TipLoop delivery package

Built: 2026-09-26

## What you received

Complete Next.js 15 + TypeScript application for a mobile-first crypto tipping site branded TipLoop.

- Dark premium UI, chrome T logo, blue / violet / cyan gradients, glass panels
- Tagline: Creators deserve the world.
- Creator signup (Supabase magic link), public `/c/{handle}` page, profile editor, QR, dashboard
- Supporter checkout via NOWPayments adapter
- Server-side 2% fee (`floor(gross_cents * 200 / 10000)`)
- Payment states: pending, processing, success, failed, expired, refunded
- Signed, idempotent webhooks + ledger
- Referral code loop and post-success “create your own page”
- Legal templates: terms, privacy, refunds, fees, crypto risks
- Vitest unit tests, GitHub Actions CI, deployment + verification docs

## What is deliberately not claimed

This is **not** production-ready until `docs/VERIFICATION.md` is completed with real Supabase and NOWPayments sandbox credentials. Live payments stay off without `PAYMENTS_ENABLED=true` and provider secrets. No successful payment is ever faked.

## Install

```bash
cd tiploop
cp .env.example .env.local
npm install
npm test
npm run dev
```
