import type { ComponentProps } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { LiveDot } from "@/components/ui/primitives";

type Props = Omit<ComponentProps<"a">, "href" | "target" | "rel"> & {
  /** Prefilled text. Never include medical details — it becomes part of a URL. */
  message?: string;
};

/** Plain anchor to WhatsApp that always opens in a new tab safely. */
export function WhatsAppLink({ message, children, "aria-label": ariaLabel, ...props }: Props) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} (opens in a new tab)` : undefined}
      {...props}
    >
      {children}
      {ariaLabel ? null : <span className="sr-only"> (opens WhatsApp in a new tab)</span>}
    </a>
  );
}

/** The design's WhatsApp pill: green live dot + label. */
export function WhatsAppButton({
  variant = "outline",
  size = "lg",
  className,
  children = "Chat on WhatsApp",
  message,
  dot = true,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  message?: string;
  dot?: boolean;
}) {
  return (
    <WhatsAppLink message={message} className={buttonClasses({ variant, size, className })}>
      {dot ? <LiveDot bright={variant === "ghost-inverse"} /> : null}
      {children}
    </WhatsAppLink>
  );
}
