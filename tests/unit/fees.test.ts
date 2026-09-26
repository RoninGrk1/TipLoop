import { describe, expect, it } from "vitest";
import { calculatePlatformFee, parseUsdToCents } from "../../src/lib/payments/fees";

describe("calculatePlatformFee", () => {
  it("takes 2% of $5.00 as 10 cents", () => {
    const b = calculatePlatformFee(500);
    expect(b.feeCents).toBe(10);
    expect(b.netCents).toBe(490);
    expect(b.grossCents).toBe(b.feeCents + b.netCents);
  });

  it("floors fractional cents", () => {
    const b = calculatePlatformFee(101);
    expect(b.feeCents).toBe(2);
    expect(b.netCents).toBe(99);
  });

  it("rejects sub-minimum tips", () => {
    expect(() => calculatePlatformFee(99)).toThrow(/Minimum/);
  });

  it("parses USD strings to cents", () => {
    expect(parseUsdToCents("5.00")).toBe(500);
    expect(parseUsdToCents(5.1)).toBe(510);
  });
});
