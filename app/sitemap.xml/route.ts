import { sitemapIds, sitemapSections, sitemapUrl } from "@/lib/sitemaps";

export const dynamic = "force-static";

export function GET() {
  // Empty sections (e.g. no published /from pages yet) are left out of the index.
  const entries = sitemapIds
    .filter((id) => sitemapSections[id]().length > 0)
    .map((id) => `  <sitemap>\n    <loc>${sitemapUrl(id)}</loc>\n  </sitemap>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
