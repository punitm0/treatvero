"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { isActivePath } from "@/components/layout/nav-links";

export function MobileMenu({ items, ctaHref }: { items: { label: string; href: string }[]; ctaHref: string }) {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink"
      >
        {open ? <X aria-hidden="true" className="size-[22px]" strokeWidth={1.75} /> : <Menu aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-line bg-canvas shadow-[0_24px_40px_-24px_rgba(20,32,29,0.25)]"
      >
        <nav aria-label="Mobile" className="container-site flex flex-col pt-2 pb-5">
          <ul className="m-0 list-none p-0">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center justify-between border-b border-line-faint text-[17px] font-medium text-ink no-underline hover:text-brand"
                >
                  {item.label}
                  <ChevronRight aria-hidden="true" className="size-5 text-ink-subtle" strokeWidth={1.75} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={ctaHref} onClick={() => setOpen(false)} className={buttonClasses({ size: "md+", className: "mt-4 h-[52px] w-full text-base" })}>
            Get Treatment Options
          </Link>
        </nav>
      </div>
    </>
  );
}
