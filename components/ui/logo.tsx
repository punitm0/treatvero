import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative block size-[22px] shrink-0 rounded-full bg-brand", className)}>
      <span className={cn("absolute top-1 right-1 block size-[7px] rounded-full bg-canvas", dotClassName)} />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2.5 text-ink no-underline hover:text-ink", className)}
      aria-label="TreatVero home"
    >
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-[-0.035em]">TreatVero</span>
    </Link>
  );
}
