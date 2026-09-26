import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, Eyebrow, SampleBadge } from "@/components/ui/primitives";

export type LegalSection = { id?: string; title: string; body: ReactNode };

/** Long-form legal layout: narrow reading column, numbered sections. */
export function LegalPage({
  title,
  path,
  intro,
  updated,
  sections,
}: {
  title: string;
  path: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <article className="pt-[clamp(28px,4vw,48px)] pb-[clamp(72px,9vw,128px)]">
      <Container>
        <Breadcrumbs items={[{ name: title, path }]} className="mb-[clamp(28px,4vw,48px)]" />
        <div className="max-w-[760px]">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-h2 mb-5">{title}</h1>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[13px] text-ink-subtle">
            <span>Last updated {updated}</span>
            <SampleBadge>Draft — pending legal review</SampleBadge>
          </div>
          <div className="text-lede mb-10 text-ink-muted">{intro}</div>
          <ol className="m-0 list-none p-0">
            {sections.map((s, i) => (
              <li key={s.title} id={s.id} className="border-t border-line py-7">
                <h2 className="mt-0 mb-3 flex gap-3 text-xl font-medium tracking-[-0.01em]">
                  <span className="pt-1 font-mono text-[13px] font-normal text-brand">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="flex flex-col gap-3 text-base leading-[1.65] text-ink-muted [&_li]:ml-5 [&_li]:list-disc [&_p]:m-0 [&_ul]:m-0 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:p-0">
                  {s.body}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </article>
  );
}
