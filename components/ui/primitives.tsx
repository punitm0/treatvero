import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Max-width 1240 container with the design's fluid gutter. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("container-site", className)} {...props} />;
}

const tones = {
  canvas: "",
  white: "bg-surface border-y border-line",
  sand: "bg-sand",
} as const;

export function Section({
  tone = "canvas",
  className,
  ...props
}: ComponentProps<"section"> & { tone?: keyof typeof tones }) {
  return <section className={cn("section-y", tones[tone], className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("eyebrow mb-4", className)} {...props} />;
}

/**
 * The design's recurring two-column section header: eyebrow + serif H2 on
 * the left, supporting paragraph aligned to the bottom on the right.
 */
export function SplitHeading({
  eyebrow,
  title,
  children,
  id,
  className,
  minCol = 420,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
  minCol?: number;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn("mb-[clamp(40px,5vw,64px)] grid items-end gap-x-16 gap-y-6", className)}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minCol}px), 1fr))` }}
    >
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading id={id} className="text-h2 m-0">
          {title}
        </Heading>
      </div>
      {children ? <div className="max-w-[480px] text-[17px] text-pretty text-ink-muted">{children}</div> : null}
    </div>
  );
}

export function LiveDot({ className, bright = false, pulse = false }: { className?: string; bright?: boolean; pulse?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-2 shrink-0 rounded-full",
        bright ? "bg-live-bright" : "bg-live",
        pulse && "relative after:absolute after:inset-0 after:rounded-full after:bg-inherit motion-safe:after:animate-ping-soft",
        className,
      )}
    />
  );
}

export function StatusPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1.5 text-[13px] font-medium text-brand",
        className,
      )}
    >
      <LiveDot pulse className="size-[7px]" />
      {children}
    </span>
  );
}

/** Amber "placeholder / sample" marker used in the design for unverified content. */
export function SampleBadge({ children = "Sample data", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-warn-line bg-warn-bg px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-warn-ink uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-full border border-line px-3 py-[5px] text-[13px] text-ink-muted", className)}>
      {children}
    </span>
  );
}
