import type { MetadataRoute } from "next";
import { APP_URL } from "@/config/constants";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/directory", "/signup", "/login", "/legal/terms", "/legal/privacy", "/legal/refunds", "/legal/fees", "/legal/risks"].map((path) => ({ url: `${APP_URL}${path}`, lastModified: new Date() }));
}
