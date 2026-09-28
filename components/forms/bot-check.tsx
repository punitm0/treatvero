"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/config";

type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile"))));
    script.addEventListener("error", () => reject(new Error("turnstile")));
  });
}

/** A one-shot promise that settles once the visitor has a verified session. */
export type SessionGate = { promise: Promise<boolean>; resolve: (ok: boolean) => void };

export function createSessionGate(): SessionGate {
  let resolve!: (ok: boolean) => void;
  const promise = new Promise<boolean>((r) => (resolve = r));
  return { promise, resolve };
}

/**
 * Cloudflare Turnstile check. Runs invisibly in the background (it only
 * shows a checkbox if Cloudflare needs an interaction), then exchanges the
 * token for a short-lived session cookie at /api/session. Uploads and the
 * final submission wait on `gate`.
 */
export function BotCheck({ gate }: { gate: SessionGate }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;

    async function exchange(token: string) {
      try {
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        gate.resolve(res.ok);
      } catch {
        gate.resolve(false);
      }
    }

    if (!siteConfig.turnstileSiteKey) {
      gate.resolve(false);
      return;
    }
    loadScript()
      .then((turnstile) => {
        if (cancelled || !ref.current) return;
        widgetId = turnstile.render(ref.current, {
          sitekey: siteConfig.turnstileSiteKey,
          action: "turnstile-spin-v2",
          appearance: "interaction-only",
          callback: (token: string) => void exchange(token),
          "error-callback": () => gate.resolve(false),
          "unsupported-callback": () => gate.resolve(false),
        });
      })
      .catch(() => gate.resolve(false));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [gate]);

  return <div ref={ref} className="empty:hidden [&>div]:mt-4" />;
}
