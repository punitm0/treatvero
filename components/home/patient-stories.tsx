import { features } from "@/lib/config";
import { Container } from "@/components/ui/primitives";

/**
 * The design reserves space for patient stories. No stories exist yet, so
 * this renders clearly-labelled empty slots — never fabricated testimonials.
 * Toggle with `features.showPatientStoriesPlaceholder`.
 */
export function PatientStories() {
  if (!features.showPatientStoriesPlaceholder) return null;
  return (
    <section aria-labelledby="stories-title" className="pb-[clamp(72px,9vw,128px)]">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 id="stories-title" className="m-0 font-serif text-[clamp(28px,3.2vw,40px)] leading-[1.1] font-normal tracking-[-0.02em]">
            Patient stories coming soon
          </h2>
          <p className="m-0 text-sm text-ink-subtle">Published only with explicit patient consent.</p>
        </div>
        <ul aria-hidden="true" className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
          {["01", "02", "03"].map((n) => (
            <li key={n} className="flex flex-col gap-[18px] rounded-[20px] border border-dashed border-line-dash bg-dropzone p-[26px]">
              <span className="self-start rounded-md border border-warn-line bg-warn-bg px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-warn-ink">
                STORY {n} · COMING SOON
              </span>
              <div className="flex flex-col gap-2">
                <span className="block h-2.5 w-full rounded-[5px] bg-line-faint" />
                <span className="block h-2.5 w-[92%] rounded-[5px] bg-line-faint" />
                <span className="block h-2.5 w-[70%] rounded-[5px] bg-line-faint" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 border-t border-dashed border-line-alt pt-4">
                {["COUNTRY", "TREATMENT", "DESTINATION"].map((l) => (
                  <div key={l}>
                    <div className="font-mono text-[10px] tracking-[0.06em] text-ink-subtle">{l}</div>
                    <div className="text-sm text-ink-subtle">—</div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
