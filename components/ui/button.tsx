import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover hover:text-white",
  outline: "border border-line-strong bg-surface text-ink hover:border-brand hover:text-ink",
  "outline-ink": "border border-ink bg-surface text-ink hover:bg-ink hover:text-white",
  dark: "bg-ink text-white hover:bg-brand-deep hover:text-white",
  inverse: "bg-white text-brand-deep hover:bg-inverse-hover hover:text-brand-deep",
  "ghost-inverse": "border border-white/30 text-white hover:border-white hover:text-white",
} as const;

const sizes = {
  sm: "h-10 px-[18px] text-sm",
  md: "h-12 px-5 text-[15px]",
  "md+": "h-[52px] px-6 text-[15px]",
  lg: "h-[54px] px-[26px] text-base",
  xl: "h-14 px-7 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type StyleProps = { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
