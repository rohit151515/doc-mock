import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return process.env.SITE_URL
    ? ["bn", "en"].map((l) => ({ url: process.env.SITE_URL + "/" + l }))
    : [];
}
