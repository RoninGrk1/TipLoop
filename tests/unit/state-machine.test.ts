import { describe, expect, it } from "vitest";
import { canTransition } from "../../src/lib/payments/state-machine";

describe("payment state machine", () => {
  it("allows pending to success", () => {
    expect(canTransition("pending", "success")).toBe(true);
  });
  it("blocks success to pending", () => {
    expect(canTransition("success", "pending")).toBe(false);
  });
  it("allows success to refunded only", () => {
    expect(canTransition("success", "refunded")).toBe(true);
    expect(canTransition("failed", "refunded")).toBe(false);
  });
});
