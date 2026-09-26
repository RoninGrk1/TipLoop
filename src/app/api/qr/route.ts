import { NextResponse } from "next/server";
import { svgQrPlaceholder } from "@/lib/qr/svg";
import { APP_URL } from "@/config/constants";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = (searchParams.get("handle") ?? "").toLowerCase();
  const payload = searchParams.get("payload");
  if (!handle && !payload) return NextResponse.json({ error: "Missing handle or payload." }, { status: 400 });
  const text = payload || `${APP_URL}/c/${handle}`;
  try {
    const QRCode = await import("qrcode");
    const svg = await QRCode.toString(text, { type: "svg", margin: 1, color: { dark: "#e8f6ff", light: "#07080d" }, width: 320 });
    return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
  } catch {
    return new NextResponse(svgQrPlaceholder(text, handle ? `@${handle}` : "TipLoop"), { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
  }
}
