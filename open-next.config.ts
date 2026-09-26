import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered and nothing revalidates, so the read-only
// static-assets cache is enough (no R2 cache bucket, queue or tag cache).
// Switch to the R2 incremental cache if ISR/revalidation is introduced.
//
// Cache interception stays OFF: with Next 16.3 it answered segment-prefetch
// RSC requests with full-page payloads, and the client router re-requested
// them in an endless loop. Re-test before enabling it after upgrades.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: false,
});
