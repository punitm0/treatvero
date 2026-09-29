"use client";

import { useEffect, useRef } from "react";

/** Records the view from the browser, so link-preview fetchers don't count as the patient opening the page. */
export function ViewBeacon({ markViewed }: { markViewed: () => Promise<void> }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void markViewed().catch(() => {});
  }, [markViewed]);
  return null;
}
