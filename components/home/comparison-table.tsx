"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { comparisonSample } from "@/data/site";
import { cn } from "@/lib/utils";

const { options, rows } = comparisonSample;

function cellValue(rowKey: string, i: number): string {
  const row = rows.find((r) => r.key === rowKey)!;
  if (rowKey === "hospital") return options[i].hospital;
  if (rowKey === "city") return options[i].city;
  return "value" in row ? row.value : "";
}

/**
 * Illustrative comparison. Desktop: a grid with a shortlist toggle per option.
 * Mobile: segmented tabs showing one option at a time.
 */
export function ComparisonTable() {
  const [pick, setPick] = useState<number>(1);
  const [tab, setTab] = useState(0);

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-hidden rounded-2xl border border-line min-[860px]:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Illustrative comparison of three sample hospital options</caption>
          <colgroup>
            <col className="w-[200px]" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-canvas">
              <td className="label-mono px-5 py-[18px] align-bottom text-ink-subtle">Illustrative</td>
              {options.map((o, i) => {
                const on = pick === i;
                return (
                  <th
                    key={o.label}
                    scope="col"
                    className={cn("border-l border-line px-5 py-[18px] font-normal", on && "bg-brand-tint-2")}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div>
                        <div className="label-mono text-brand">{o.label}</div>
                        <div className="text-base font-medium">{o.hospital}</div>
                      </div>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPick(on ? -1 : i)}
                        className={cn(
                          "flex h-[34px] items-center gap-1 rounded-full border px-3 text-[13px] whitespace-nowrap transition-colors",
                          on ? "border-brand bg-brand text-white" : "border-line-strong bg-surface text-ink hover:border-brand",
                        )}
                      >
                        {on ? <Check aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
                        {on ? "Shortlisted" : "Shortlist"}
                        <span className="sr-only"> {o.label}</span>
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.key} className={cn(ri > 0 && "border-t border-line-soft")}>
                <th scope="row" className="px-5 py-4 text-sm font-normal text-ink-subtle">
                  {r.label}
                </th>
                {options.map((o, i) => (
                  <td
                    key={o.label}
                    className={cn(
                      "border-l border-line px-5 py-4 text-[15px]",
                      pick === i && "bg-brand-tint-3",
                      "mono" in r && r.mono && "font-mono",
                    )}
                  >
                    {cellValue(r.key, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="min-[860px]:hidden">
        <div role="tablist" aria-label="Sample options" className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-sand p-1">
          {options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              role="tab"
              id={`cmp-tab-${i}`}
              aria-selected={tab === i}
              aria-controls="cmp-panel"
              onClick={() => setTab(i)}
              className={cn(
                "h-11 rounded-[9px] text-sm font-medium text-ink transition-colors",
                tab === i ? "bg-surface shadow-tab" : "bg-transparent",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div id="cmp-panel" role="tabpanel" aria-labelledby={`cmp-tab-${tab}`}>
          <dl className="m-0 overflow-hidden rounded-2xl border border-line">
            {rows.map((r, ri) => (
              <div key={r.key} className={cn("flex flex-col gap-0.5 px-4 py-3.5", ri > 0 && "border-t border-line-soft")}>
                <dt className="text-xs text-ink-subtle">{r.label}</dt>
                <dd className={cn("m-0 text-[15px]", "mono" in r && r.mono && "font-mono")}>{cellValue(r.key, tab)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
