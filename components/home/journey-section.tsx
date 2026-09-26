import { patientJourney } from "@/data/site";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function JourneySection() {
  const last = patientJourney.length - 1;
  return (
    <section aria-labelledby="journey-title" className="section-y border-y border-line bg-surface">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-20 gap-y-12">
        <div className="md:sticky md:top-[108px]">
          <Eyebrow>Patient journey</Eyebrow>
          <h2 id="journey-title" className="text-h2 mb-5">
            From home, and back again — with someone beside you.
          </h2>
          <p className="mb-7 text-[17px] text-pretty text-ink-muted">At every stage, you know what&apos;s happening next and who to ask.</p>
          <ul className="m-0 flex list-none gap-5 p-0 text-sm text-ink-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="block size-3 rounded-full border-[1.5px] border-ink" />
              You
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="block size-3 rounded-full bg-brand" />
              TreatVero, alongside
            </li>
          </ul>
        </div>
        <ol className="m-0 list-none p-0">
          {patientJourney.map((s, i) => {
            const end = i === 0 || i === last;
            return (
              <li key={s.stage}>
                {s.phase ? (
                  <p className={cn("label-mono m-0 pb-4 pl-10 text-ink-subtle", i > 0 && "pt-3")}>{s.phase}</p>
                ) : null}
                <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block shrink-0 rounded-full border-[1.5px] border-ink",
                        end ? "mt-1 size-4 bg-ink" : "mt-1.5 size-3 bg-surface",
                      )}
                    />
                    <span aria-hidden="true" className={cn("w-px flex-1 bg-line-alt", i === last && "opacity-0")} />
                  </div>
                  <div className="flex flex-wrap items-start gap-x-5 gap-y-2 pb-[18px]">
                    <h3
                      className={cn(
                        "m-0 flex-[1_1_160px] pt-0.5 leading-[1.3]",
                        end ? "font-serif text-[22px] font-normal" : "text-base font-medium",
                      )}
                    >
                      {s.stage}
                    </h3>
                    <p className="m-0 flex flex-[2_1_260px] items-start gap-2.5 rounded-xl border border-line-faint bg-sand-3 px-3.5 py-2.5 text-sm leading-[1.45] text-ink-muted">
                      <span aria-hidden="true" className="mt-1.5 block size-2 shrink-0 rounded-full bg-brand" />
                      <span>
                        <span className="sr-only">TreatVero: </span>
                        {s.role}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
