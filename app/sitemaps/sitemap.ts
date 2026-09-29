import type { MetadataRoute } from "next";
import { sitemapIds, sitemapSections, type SitemapId } from "@/lib/sitemaps";

export async function generateSitemaps() {
  return sitemapIds.map((id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = (await props.id) as SitemapId;
  return sitemapSections[id]?.() ?? [];
}
