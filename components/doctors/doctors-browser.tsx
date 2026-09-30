"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string };

/**
 * Treatment and city filters for the doctor listing. Cards are rendered on
 * the server; only the filter state lives on the client.
 */
export function DoctorsBrowser({
  treatments,
  cities,
  cards,
}: {
  treatments: Option[];
  cities: Option[];
  cards: { key: string; city: string; treatments: string[]; node: ReactNode }[];
}) {
  const [treatment, setTreatment] = useState("all");
  const [city, setCity] = useState("all");
  const visible = cards.filter(
    (c) => (treatment === "all" || c.treatments.includes(treatment)) && (city === "all" || c.city === city),
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink-subtle">Treatment</span>
          <select
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="min-h-11 rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink"
          >
            <option value="all">All treatments</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <div role="group" aria-label="Filter by city" className="flex gap-2 overflow-x-auto pb-1">
          {[{ slug: "all", name: "All cities" }, ...cities].map((f) => {
            const on = f.slug === city;
            return (
              <button
                key={f.slug}
                type="button"
                aria-pressed={on}
                onClick={() => setCity(f.slug)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
                  on ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink hover:border-ink",
                )}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-0 mb-5 text-sm text-ink-subtle" aria-live="polite">
        {visible.length} doctor{visible.length === 1 ? "" : "s"}
      </p>
      {visible.length ? (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
          {visible.map((c) => (
            <li key={c.key} className="grid">
              {c.node}
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 rounded-[20px] border border-line bg-surface p-[22px] text-[15px] text-ink-muted">
          No listed doctors match these filters yet. We can still request options from specialists for your case.
        </p>
      )}
    </>
  );
}
