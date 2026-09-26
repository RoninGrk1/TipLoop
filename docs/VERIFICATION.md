# Verification gate

TipLoop must not be described as production-ready until every line is checked.

## Implementation

- [ ] `npm run build` succeeds against production env
- [ ] Magic-link signup creates a `profiles` row with unique handle
- [ ] Public page `/c/{handle}` renders and is shareable on mobile
- [ ] QR route returns a scannable SVG
- [ ] Directory lists only `is_public` creators

## Payments

- [ ] Sandbox invoice created with real provider credentials
- [ ] Underpayment / expiry mapped to `expired` or `failed`
- [ ] Signed webhook moves row to `success`
- [ ] Unsigned webhook rejected (401)
- [ ] Replay of the same event does not double-write ledger
- [ ] `gross_cents = fee_cents + net_cents` on every success
- [ ] Success UI stays pending until DB status is `success`
- [ ] Refund path tested or explicitly documented as unsupported

## Security

- [ ] Service role key never shipped to the browser
- [ ] RLS enabled on profiles, payments, ledger
- [ ] Rate limit on `/api/payments/create`
- [ ] CSP / HTTPS / secure cookies on the host
- [ ] Secrets scanned out of git

## Tests & CI

- [ ] `npm test` green
- [ ] GitHub Actions lint + typecheck + test + build green

## Compliance

- [ ] Counsel-reviewed legal pages
- [ ] Provider KYB approved
- [ ] Jurisdictional launch list documented
