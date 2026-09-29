import { cn } from "@/lib/utils";

/** Small building blocks shared by admin pages. */

export function Card({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="label-mono m-0 font-normal text-ink-subtle">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="m-0 text-[15px]">{children || <span className="text-ink-subtle">—</span>}</dd>
    </div>
  );
}

export const inputClass =
  "h-10 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm outline-none focus:border-brand disabled:bg-sand-2";
export const textareaClass =
  "w-full resize-y rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm outline-none focus:border-brand";

export function Label({ text, children, className }: { text: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs text-ink-subtle">{text}</span>
      {children}
    </label>
  );
}

/** Collapsible panel for secondary forms (add option, edit details…). */
export function Disclosure({
  summary,
  children,
  open,
  className,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
}) {
  return (
    <details open={open} className={cn("group rounded-xl border border-line-soft", className)}>
      <summary className="cursor-pointer list-none px-3.5 py-2.5 text-sm font-medium text-brand select-none [&::-webkit-details-marker]:hidden">
        <span className="mr-1.5 inline-block transition-transform group-open:rotate-90">›</span>
        {summary}
      </summary>
      <div className="border-t border-line-soft p-3.5">{children}</div>
    </details>
  );
}
