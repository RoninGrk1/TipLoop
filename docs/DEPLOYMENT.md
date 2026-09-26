# TipLoop deployment

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- PostgreSQL via Supabase
- Supabase Auth (magic links)
- NOWPayments invoices + signed IPN webhooks (optional Coinbase Commerce verifier)

## 1. Provision Supabase

1. Create a project.
2. Copy URL, anon key, and service role key into environment variables.
3. Run `supabase/migrations/0001_init.sql` in the SQL editor.
4. Enable email auth. Add redirect URLs: `https://YOUR_DOMAIN/auth/callback`.

## 2. Payment provider (required for live tips)

NOWPayments production checklist:

- Business entity and accepted use case
- API key + IPN secret
- IPN callback `https://YOUR_DOMAIN/api/webhooks/nowpayments`
- Confirm platform-fee / payout split options with NOWPayments sales if you need automatic withholding
- Sandbox first (`https://api-sandbox.nowpayments.io` is not wired by default — point the adapter at sandbox only after reviewing their current sandbox contract)

Until `PAYMENTS_ENABLED=true` **and** `NOWPAYMENTS_API_KEY` **and** `NOWPAYMENTS_IPN_SECRET` are set, checkout creates no live invoice and never reports success.

## 3. Hosting

Vercel / Fly / any Node 20+ host:

```bash
npm ci
npm run test
npm run build
npm start
```

Set every variable from `.env.example`.

Add a cron (every 5 minutes) that POSTs `/api/cron/expire-payments` with `Authorization: Bearer $CRON_SECRET`.

## 4. Monitoring

- `/api/health` for uptime checks
- Attach Sentry by setting `SENTRY_DSN` and adding `@sentry/nextjs` when you are ready
- Alert on webhook 401s (signature failures) and on payments stuck in `processing` > TTL

## 5. Production-readiness gate

Do **not** market the site as production-ready until all items in `docs/VERIFICATION.md` pass.
