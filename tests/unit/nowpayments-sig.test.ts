import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { signNowPaymentsFixture, verifyNowPaymentsSignature } from "../../src/lib/payments/provider";
describe("NOWPayments signature", () => {
  const secret = "ipn-test-secret";
  beforeEach(() => { process.env.NOWPAYMENTS_IPN_SECRET = secret; });
  afterEach(() => { delete process.env.NOWPAYMENTS_IPN_SECRET; });
  it("accepts a signature over sorted keys", () => {
    const payload = { payment_status: "finished", order_id: "abc", amount: 5 };
    const sig = signNowPaymentsFixture(secret, payload);
    expect(verifyNowPaymentsSignature(JSON.stringify(payload), sig)).toBe(true);
  });
  it("rejects a tampered payload", () => {
    const payload = { payment_status: "finished", order_id: "abc" };
    const sig = signNowPaymentsFixture(secret, payload);
    expect(verifyNowPaymentsSignature(JSON.stringify({ ...payload, payment_status: "failed" }), sig)).toBe(false);
  });
});
