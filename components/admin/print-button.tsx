"use client";

import { Printer } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

/** Opens the browser's print dialog, where "Save as PDF" produces the file. */
export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses({ variant: "dark", size: "sm", className: "gap-1.5" })}>
      <Printer aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}
