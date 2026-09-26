export function svgQrPlaceholder(payload: string, label = "Scan to pay"): string {
  const safe = payload.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="320" height="360" viewBox="0 0 320 360"><rect width="320" height="360" rx="24" fill="#07080d"/><rect x="24" y="24" width="272" height="272" rx="16" fill="#10121a" stroke="#22d3ee" stroke-opacity="0.4"/><text x="160" y="160" text-anchor="middle" fill="#e8f6ff" font-size="14">${label}</text><text x="160" y="330" text-anchor="middle" fill="#7dd3fc" font-size="10">${safe.slice(0, 42)}</text></svg>`;
}
