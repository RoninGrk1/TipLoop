import { describe, expect, it } from "vitest";
import { hmacSha512Hex, safeEqualHex } from "../../src/lib/security/crypto";
describe("webhook signatures", () => {
  it("computes stable hmac and compares safely", () => {
    const hex = hmacSha512Hex("secret", "{\"ok\":true}");
    expect(hex).toHaveLength(128);
    expect(safeEqualHex(hex, hex)).toBe(true);
    expect(safeEqualHex(hex, "aa".repeat(64))).toBe(false);
  });
});
