import { Check, Minus } from "lucide-react";
import { formatPlanPrice, planComparison, plans } from "@/data/pricing";
import { cn } from "@/lib/utils";

function Mark({ on }: { on: boolean }) {
  return on ? (
    <>
      <Check aria-hidden="true" className="mx-auto size-5 text-brand" strokeWidth={2} />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <Minus aria-hidden="true" className="mx-auto size-5 text-line-hover" strokeWidth={1.75} />
      <span className="sr-only">Not included</span>
    </>
  );
}

/** Basic vs Concierge — styled like the design's comparison grid, not a bare table. */
export function PricingComparison() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Features included in the Basic and Concierge plans</caption>
        <thead>
          <tr className="border-b border-line bg-canvas">
            <th scope="col" className="label-mono px-[clamp(14px,2vw,20px)] py-[18px] font-normal text-ink-subtle">
              Feature
            </th>
            {[plans.basic, plans.concierge].map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cn(
                  "w-[26%] border-l border-line px-3 py-[18px] text-center font-normal sm:w-[22%]",
                  p.id === "concierge" && "bg-brand-tint-2",
                )}
              >
                <div className="text-[15px] font-medium sm:text-base">{p.name}</div>
                <div className="font-mono text-xs text-ink-subtle">{formatPlanPrice(p)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planComparison.map((row, i) => (
            <tr key={row.feature} className={cn(i > 0 && "border-t border-line-soft")}>
              <th scope="row" className="px-[clamp(14px,2vw,20px)] py-3.5 text-sm font-normal text-ink sm:text-[15px]">
                {row.feature}
              </th>
              <td className="border-l border-line px-3 py-3.5 text-center">
                <Mark on={row.basic} />
              </td>
              <td className="border-l border-line bg-brand-tint-3 px-3 py-3.5 text-center">
                <Mark on={row.concierge} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
