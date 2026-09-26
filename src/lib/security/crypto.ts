import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function sha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256Hex(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function hmacSha512Hex(secret: string, payload: string) {
  return createHmac("sha512", secret).update(payload).digest("hex");
}

export function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function newIdempotencyKey() {
  return `tl_${randomToken(16)}`;
}
