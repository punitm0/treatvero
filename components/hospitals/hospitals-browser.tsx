"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * City filter for hospital listings. Cards are rendered on the server and
 * passed in keyed by city, so only the filter state lives on the client.
 */
export function HospitalsBrowser({
  cities,
  cards,
  initialAllLimit,
}: {
  cities: { slug: string; name: string }[];
  cards: { key: string; city: string; node: ReactNode }[];
  /** Show only the first N cards in "All cities" (India page preview). */
  initialAllLimit?: number;
}) {
  const [city, setCity] = useState<string>("all");
  const visible =
    city === "all" ? (initialAllLimit ? cards.slice(0, initialAllLimit) : cards) : cards.filter((c) => c.city === city);

  const filters = [{ slug: "all", name: "All cities" }, ...cities];
  return (
    <>
      <div role="group" aria-label="Filter by city" className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => {
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
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} hospital{visible.length === 1 ? "" : "s"}
      </p>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
        {visible.map((c) => (
          <li key={c.key} className="grid">
            {c.node}
          </li>
        ))}
      </ul>
    </>
  );
}
