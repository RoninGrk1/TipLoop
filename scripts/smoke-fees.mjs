// Standalone smoke test for fee math (no vitest required).
function calculatePlatformFee(grossCents, feeBps = 200) {
  if (grossCents < 100) throw new Error("Minimum tip is 1 USD.");
  const feeCents = Math.floor((grossCents * feeBps) / 10_000);
  const netCents = grossCents - feeCents;
  if (netCents <= 0) throw new Error("Net payout must be greater than zero.");
  return { grossCents, feeCents, netCents };
}

const five = calculatePlatformFee(500);
if (five.feeCents !== 10 || five.netCents !== 490) throw new Error("2% of $5 failed");
const odd = calculatePlatformFee(101);
if (odd.feeCents !== 2 || odd.netCents !== 99) throw new Error("floor rounding failed");
let threw = false;
try {
  calculatePlatformFee(99);
} catch {
  threw = true;
}
if (!threw) throw new Error("minimum bound failed");
console.log("smoke-fees: ok");
