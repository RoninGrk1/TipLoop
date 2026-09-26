# TipLoop

Creators deserve the world.

Mobile-first crypto tipping for creators. Unique public pages, QR codes, a 2% server-side platform fee, verified webhooks, and an append-only ledger.

## Honest status

The application code, schema, payment state machine, legal templates, tests, and CI workflow are in this repository.

**Live payments are disabled until provider credentials, KYB, and the checklist in docs/VERIFICATION.md are complete.** TipLoop will not invent successful payments or fabricate users.

## Quick start

```bash
cp .env.example .env.local
npm install
npm test
npm run dev
```

Open http://localhost:3000

Without Supabase keys the marketing pages, legal pages, and health endpoint still run. Auth, directory data, and checkout persistence require Supabase. Checkout invoices require NOWPayments.

## Product surface

- `/` landing
- `/signup` `/login` `/auth/callback` `/onboarding`
- `/c/{handle}` public tip page
- `/c/{handle}/{pending|success|failed|expired|refunded}`
- `/directory`
- `/dashboard` settings, analytics, payouts, referrals
- `/legal/{terms,privacy,refunds,fees,risks}`
- `/api/payments/create` `/api/payments/status` `/api/payments/refund`
- `/api/webhooks/nowpayments` `/api/webhooks/coinbase`
- `/api/qr` `/api/health` `/api/cron/expire-payments`

## Docs

- `docs/DEPLOYMENT.md`
- `docs/PAYMENTS.md`
- `docs/COMPLIANCE.md`
- `docs/VERIFICATION.md`

## Fee

`fee_cents = floor(gross_cents * 200 / 10000)` — only on the server.
