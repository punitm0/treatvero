import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SiteChrome } from "@/components/layout/site-chrome";
import { JsonLd } from "@/components/ui/json-ld";

/** Public marketing site: header, footer and floating WhatsApp actions. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
