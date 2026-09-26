# TreatVero

Marketing site and patient enquiry flow for **TreatVero** — an independent medical travel facilitator and patient concierge. TreatVero is not a hospital and does not provide medical advice.

Built from the Claude Design handoff (Home, India, Treatment Enquiry, header and footer prototypes).

## Stack

Next.js 16 (App Router, Turbopack) on **Cloudflare Workers** via the OpenNext adapter · D1 (treatment requests) · R2 (private medical reports) · Workers Rate Limiting · TypeScript · Tailwind CSS v4 · React Hook Form + Zod · Motion (enquiry step transitions only) · Lucide icons · `next/font` (Geist, Geist Mono, Newsreader) · `next/image`.

## Getting started

```bash
npm install
cp .env.example .env.local                           # optional
npx wrangler d1 migrations apply treatvero --local   # create the local D1 schema
npm run dev
```

`next dev` uses local emulations of D1, R2 and the rate limiters (stored in `.wrangler/`), so no Cloudflare account is needed to develop. `npm run preview` builds with OpenNext and runs the app in the real Workers runtime locally.

> Shell environment variables override `.env*` files. If `NEXT_PUBLIC_SITE_URL` is exported in your shell, canonicals and the sitemap will use it.

Scripts: `npm run dev`, `npm run preview`, `npm run deploy`, `npm run cf-typegen` (after editing `wrangler.jsonc`), `npm run lint`, `npx tsc --noEmit`.

## Deploying to Cloudflare

One-time setup (requires `npx wrangler login`):

```bash
npx wrangler d1 create treatvero            # paste the database_id into wrangler.jsonc
npx wrangler r2 bucket create treatvero-reports
npx wrangler d1 migrations apply treatvero --remote
npx wrangler r2 bucket lifecycle add treatvero-reports purge-abandoned-uploads pending/ --expire-days 7
```

Then `npm run deploy`. Build-time `NEXT_PUBLIC_*` values must be present in the environment that runs the build.

- **Never** enable public access (r2.dev or a custom domain) on `treatvero-reports`.
- Uploads land in `pending/` and move to `requests/<reference>/` when an enquiry is submitted; the lifecycle rule removes abandoned uploads.
- Read requests with `npx wrangler d1 execute treatvero --remote --command "SELECT * FROM treatment_requests ORDER BY created_at DESC LIMIT 20"`, or build an authenticated internal view.

## Where things live

| Path | Purpose |
| --- | --- |
| `app/globals.css` | Design tokens (colours, type scale, container, section rhythm) from the mockup |
| `data/pricing.ts` | **Single source of truth for plans and prices** (`priceUSD: null` renders `$XX` / `$XXX`) |
| `data/treatments.ts`, `data/hospitals.ts`, `data/destinations.ts`, `data/faqs.ts`, `data/site.ts` | Content, separate from components |
| `data/seo-pages.ts` | Registry for `/india/[slug]` and `/from/[country]` — only `published` entries are generated |
| `components/ui` | Buttons, section primitives, FAQ (native `<details>`), breadcrumbs, JSON-LD, WhatsApp links |
| `components/{layout,home,forms,pricing,treatments,hospitals,destinations}` | Page sections |
| `lib/validation/enquiry.ts` | Zod schema shared by the form and the server action |
| `wrangler.jsonc`, `open-next.config.ts`, `migrations/` | Cloudflare bindings, OpenNext config, D1 schema |
| `lib/requests` | `saveTreatmentRequest()` — D1 store; add HubSpot/Airtable/CRM adapters behind the same interface |
| `lib/uploads` | Private R2 report storage + magic-byte file validation (20 MB per file) |
| `lib/payments` | `createCheckoutSession()`, `verifyPayment()`, `getPaymentStatus()` — `manual` by default, Stripe Checkout when configured |
| `lib/rate-limit.ts` | Workers Rate Limiting bindings (enquiries 5/min, uploads 20/min per IP) |

## Content and trust rules

- No fabricated testimonials, statistics, partnerships, accreditations or outcomes. The patient-stories band shows labelled empty slots (`features.showPatientStoriesPlaceholder` in `lib/config.ts`); metrics are hidden.
- Hospitals in `data/hospitals.ts` are **sample data** (`isSample: true`, `isConfirmedPartner: false`): labelled in the UI, `noindex`, and excluded from the sitemap.
- The comparison table uses clearly marked placeholder values.
- No treatment prices are published.

## Production TODOs

- **Internal access:** there's no admin UI yet — decide who can read D1/R2 (Cloudflare account roles) and consider Cloudflare Access for any internal tool.
- **Bot protection:** consider Turnstile on the enquiry form and a WAF rate-limit rule (Workers rate limits are per location).
- **Cache interception** is disabled in `open-next.config.ts` (it caused an RSC prefetch loop with Next 16.3); re-test before enabling.
- **Payments:** set real prices in `data/pricing.ts`; if using Stripe, add a signature-verified webhook before relying on payment status.
- **CSP:** move to a nonce-based policy to drop `'unsafe-inline'` scripts.
- **Legal pages** are drafts pending legal review.
- **`/from/*` pages** need verified country-specific content before publishing.
