# Payments

## Fee model

- 2.00% platform fee (`PLATFORM_FEE_BPS = 200`)
- Integer cents, floor division
- Authoritative calculation lives in `src/lib/payments/fees.ts`
- UI estimates are labeled as estimates

## States

`pending → processing → success`
`pending|processing → failed|expired`
`success → refunded`

Success is written only after a verified webhook. The success page re-reads the database; it does not trust the query string.

## Idempotency

- Each checkout has `idempotency_key`
- Webhook events unique on `(provider, event_id)`
- Duplicate events return applied=false without mutating ledger twice

## Refunds

NOWPayments refunds need the original payer address and refund API access. The refund route fails closed with an explicit error until that integration is completed and legally approved.

## What is intentionally not faked

- No simulated "paid" buttons
- No seeded successful production transactions
- No client-side fee settlement
