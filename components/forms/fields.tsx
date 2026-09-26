import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle/80 focus:border-brand focus:shadow-[0_0_0_3px_rgba(29,90,82,0.12)] aria-[invalid=true]:border-error";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 mb-0 text-[13px] text-error">
      {message}
    </p>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
      {children}
      {hint ? <span className="font-normal text-ink-subtle"> — {hint}</span> : null}
    </label>
  );
}

/** Group wrapper for chip/radio sets — a real fieldset with a legend. */
export function ChoiceGroup({
  legend,
  hint,
  error,
  errorId,
  children,
}: {
  legend: string;
  hint?: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2.5 p-0 text-sm font-medium">
        {legend}
        {hint ? <span className="font-normal text-ink-subtle"> — {hint}</span> : null}
      </legend>
      {children}
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

type ChipProps = Omit<ComponentProps<"input">, "type" | "className"> & {
  label: ReactNode;
  shape?: "tile" | "pill" | "card";
  sublabel?: ReactNode;
};

/**
 * A native radio input visually rendered as the design's chip. Keyboard
 * arrow navigation and screen-reader semantics come from the browser.
 */
export function ChoiceChip({ label, sublabel, shape = "pill", disabled, ...input }: ChipProps) {
  return (
    <label className={cn("relative block", disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer")}>
      <input type="radio" className="peer sr-only" disabled={disabled} {...input} />
      <span
        className={cn(
          "flex border border-line-alt bg-surface text-ink transition-colors",
          "peer-checked:border-brand peer-checked:bg-brand-tint",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
          !disabled && "hover:border-line-hover",
          shape === "pill" && "min-h-11 items-center rounded-full px-4 text-sm",
          shape === "tile" && "min-h-[46px] items-center rounded-[10px] px-3.5 py-2.5 text-sm leading-[1.3]",
          shape === "card" && "min-h-16 flex-col justify-center gap-[3px] rounded-xl px-3.5 py-3",
        )}
      >
        {shape === "card" ? <span className="text-[15px] font-medium">{label}</span> : label}
        {sublabel ? <span className="text-xs">{sublabel}</span> : null}
      </span>
    </label>
  );
}
