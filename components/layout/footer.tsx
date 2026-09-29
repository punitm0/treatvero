import Link from "next/link";
import { treatments } from "@/data/treatments";
import { destinations } from "@/data/destinations";
import { publishedSourceCountryPages } from "@/data/seo-pages";
import { siteConfig } from "@/lib/config";
import { LogoMark } from "@/components/ui/logo";

const company = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Concierge", href: "/concierge" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
  { label: "Cookie Policy", href: "/privacy#cookies" },
  { label: "Sitemap", href: "/sitemap" },
];

const linkClass = "text-ink no-underline hover:text-brand";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 text-sm">
      <h2 className="label-mono mb-1 font-normal text-ink-subtle">{title}</h2>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{children}</ul>
    </div>
  );
}

export function Footer() {
  const footerTreatments = treatments.slice(0, 6);
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="container-site pt-16 pb-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-x-8 gap-y-10">
          <div className="flex min-w-[200px] flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[19px] font-semibold tracking-[-0.035em]">TreatVero</span>
            </div>
            <p className="m-0 max-w-[260px] text-sm leading-[1.55] text-ink-muted">
              {siteConfig.tagline} Independent patient support for treatment abroad.
            </p>
          </div>
          <Column title="Treatments">
            {footerTreatments.map((t) => (
              <li key={t.slug}>
                <Link href={`/treatments/${t.slug}`} className={linkClass}>
                  {t.shortName}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/treatments" className={linkClass}>
                All treatments
              </Link>
            </li>
          </Column>
          <Column title="Destinations">
            {destinations
              .filter((d) => d.status !== "planned")
              .map((d) =>
                d.status === "available" && d.href ? (
                  <li key={d.slug}>
                    <Link href={d.href} className={linkClass}>
                      {d.name}
                    </Link>
                  </li>
                ) : (
                  <li key={d.slug} className="text-ink-subtle">
                    {d.name} — Coming Soon
                  </li>
                ),
              )}
          </Column>
          {publishedSourceCountryPages.length ? (
            <Column title="Patients from">
              {publishedSourceCountryPages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/from/${p.slug}`} className={linkClass}>
                    {p.country.replace(/^the /, "")}
                  </Link>
                </li>
              ))}
            </Column>
          ) : null}
          <Column title="Company">
            {company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
          <Column title="Legal">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-line pt-6 text-[13px] leading-normal text-ink-subtle">
          <p className="m-0 max-w-[680px]">
            TreatVero is an independent medical travel facilitator and does not provide medical diagnosis, treatment or
            medical advice.
          </p>
          <span>
            © {siteConfig.foundingYear} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
