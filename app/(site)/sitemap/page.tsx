import Link from "next/link";
import { treatments } from "@/data/treatments";
import { hospitals } from "@/data/hospitals";
import { cities, getCity } from "@/data/destinations";
import { publishedIndiaPages, publishedSourceCountryPages } from "@/data/seo-pages";
import { mainPages } from "@/lib/sitemaps";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";

export const metadata = pageMetadata({
  title: "Sitemap",
  description: "Every page on TreatVero: treatments, India city and treatment guides, hospitals and company information.",
  path: "/sitemap",
});

type SitemapLink = { href: string; label: string };
type Group = { title: string; links: SitemapLink[] };

const linkClass = "text-ink no-underline hover:text-brand";

function LinkList({ links }: { links: SitemapLink[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-2.5 p-0 text-[15px]">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={linkClass}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  const groups: Group[] = [
    { title: "Main pages", links: mainPages.map((p) => ({ href: p.path, label: p.label })) },
    { title: "Treatments", links: treatments.map((t) => ({ href: `/treatments/${t.slug}`, label: t.name })) },
    {
      title: "India guides",
      links: publishedIndiaPages.map((p) => ({
        href: `/india/${p.slug}`,
        label: p.kind === "treatment" ? `${p.label} in India` : `Medical treatment in ${getCity(p.city).name}`,
      })),
    },
    {
      title: "Patients by country",
      links: publishedSourceCountryPages.map((p) => ({ href: `/from/${p.slug}`, label: `Patients from ${p.country}` })),
    },
  ].filter((g) => g.links.length > 0);

  const hospitalsByCity = cities
    .map((c) => ({
      city: c.name,
      links: hospitals.filter((h) => h.city === c.slug).map((h) => ({ href: `/hospitals/${h.slug}`, label: h.name })),
    }))
    .filter((g) => g.links.length > 0);

  return (
    <article className="pt-[clamp(28px,4vw,48px)] pb-[clamp(72px,9vw,128px)]">
      <Container>
        <Breadcrumbs items={[{ name: "Sitemap", path: "/sitemap" }]} className="mb-[clamp(28px,4vw,48px)]" />
        <Eyebrow>Sitemap</Eyebrow>
        <h1 className="text-h2 mb-10">Every page on TreatVero</h1>
        {groups.map((g) => (
          <section key={g.title} className="border-t border-line py-8">
            <h2 className="mt-0 mb-5 text-xl font-medium tracking-[-0.01em]">{g.title}</h2>
            <LinkList links={g.links} />
          </section>
        ))}
        {hospitalsByCity.length > 0 && (
          <section className="border-t border-line py-8">
            <h2 className="mt-0 mb-5 text-xl font-medium tracking-[-0.01em]">Hospitals</h2>
            <div className="flex flex-col gap-7">
              {hospitalsByCity.map((g) => (
                <div key={g.city}>
                  <h3 className="label-mono mt-0 mb-3 font-normal text-ink-subtle">{g.city}</h3>
                  <LinkList links={g.links} />
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
