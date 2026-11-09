import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const url = process.env.SITE_URL;
  return url
    ? {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: url + "/sitemap.xml",
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
