# Bug audit (2026-09-26)

## Fixed before packaging

1. **NOWPayments IPN signed the raw body.** Official spec requires HMAC-SHA512 of recursively key-sorted JSON. Corrected in `src/lib/payments/provider.ts` with unit tests.
2. **`.gitignore` excluded `.env.example`.** Restored with `!.env.example`.
3. **Illegal `PaymentStatus` import from `@/types`.** Removed.
4. **Directory search passed raw user text into `.or()`.** Stripped `%(),` to reduce filter injection.

## Known residual risks (not claimed production-ready)

- In-memory rate limiter is per-instance; use Redis before multi-region.
- Refund API is fail-closed pending NOWPayments refund credentials + payer address.
- Legal pages are templates, not counsel-reviewed.
- Live checkout requires KYB + env flags.
- Service-role key is required for public profile reads today; a tighter anon policy could replace that later.
- Coinbase adapter verifies signatures but does not create Coinbase charges yet.
- No Sentry package installed until `SENTRY_DSN` workflow is added.
- End-to-end provider sandbox test cannot run without operator credentials.
