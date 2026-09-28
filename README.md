# TreatVero

Marketing site and patient enquiry flow for **TreatVero** — an independent medical travel facilitator and patient concierge. TreatVero is not a hospital and does not provide medical advice.

Built from the Claude Design handoff (Home, India, Treatment Enquiry, header and footer prototypes).

## Stack

Next.js 16 (App Router, Turbopack) on **Cloudflare Workers** via the OpenNext adapter · D1 (treatment requests) · R2 (private medical reports) · Workers Rate Limiting · Turnstile (bot protection) · Resend (enquiry alerts) · Cloudflare Access (admin) · TypeScript · Tailwind CSS v4 · React Hook Form + Zod · Motion (enquiry step transitions only) · Lucide icons · `next/font` (Geist, Geist Mono, Newsreader) · `next/image`.

## Getting started

```bash
npm install
cp .env.example .env.local                           # optional
npx wrangler d1 migrations apply treatvero --local   # create the local D1 schema
npm run dev
```

`next dev` uses local emulations of D1, R2 and the rate limiters (stored in `.wrangler/`), so no Cloudflare account is needed to develop. Turnstile uses Cloudflare's always-pass test keys and the admin signs you in as `dev@localhost`. `npm run preview` builds with OpenNext and runs the app in the real Workers runtime locally (copy `.dev.vars.example` to `.dev.vars` first).

> Shell environment variables override `.env*` files. If `NEXT_PUBLIC_SITE_URL` is exported in your shell, canonicals and the sitemap will use it — unset it before `npm run deploy`.

Scripts: `npm run dev`, `npm run preview`, `npm run deploy`, `npm run cf-typegen` (after editing `wrangler.jsonc`), `npm run lint`, `npx tsc --noEmit`.

## Deploying to Cloudflare

One-time setup (requires `npx wrangler login`):

```bash
npx wrangler d1 create treatvero            # paste the database_id into wrangler.jsonc
npx wrangler r2 bucket create treatvero-reports
npx wrangler d1 migrations apply treatvero --remote
npx wrangler r2 bucket lifecycle add treatvero-reports purge-abandoned-uploads pending/ --expire-days 7
npx wrangler secret put TURNSTILE_SECRET        # from the Turnstile widget
npx wrangler secret put SESSION_SECRET          # e.g. `openssl rand -base64 32`
npx wrangler secret put RESEND_API_KEY          # Resend API key (sending access) for enquiry alerts
```

Run `npx wrangler d1 migrations apply treatvero --remote` again whenever `migrations/` changes, **before** deploying.

Then `npm run deploy`. Build-time `NEXT_PUBLIC_*` values must be present in the environment that runs the build.

- **Never** enable public access (r2.dev or a custom domain) on `treatvero-reports`.
- Uploads land in `pending/` and move to `requests/<reference>/` when an enquiry is submitted; the lifecycle rule removes abandoned uploads.
- New enquiries email `ENQUIRY_ALERT_TO` (`wrangler.jsonc`) through Resend, from `ENQUIRY_ALERT_FROM`; `treatvero.com` must be a verified domain in Resend. Alerts contain no patient name, contact details or medical description — only a link to the admin.

## Admin

The coordination-team admin lives at an unlisted path, `ADMIN_PATH` in `lib/admin/path.ts` (never linked, not in robots.txt or the sitemap). It lists enquiries with status filters and search, shows full request details, streams medical reports from R2, and records status changes, internal notes and report downloads with the signed-in user's email.

Access is enforced by **Cloudflare Access**, and the app verifies the Access JWT itself (`lib/admin/auth.ts`), so the admin stays closed even if the Worker is reached another way. Without a valid token the path returns 404. To set it up:

1. Cloudflare dashboard → Zero Trust → Access → Applications → **Add a self-hosted application** for `treatvero.com/<ADMIN_PATH>` (the domain must be on Cloudflare).
2. Add an **Allow** policy listing the team's email addresses (login with one-time PIN or Google).
3. Copy the application's **AUD tag** and your team domain (`<team>.cloudflareaccess.com`) into `CF_ACCESS_AUD` and `CF_ACCESS_TEAM_DOMAIN` in `wrangler.jsonc`, then deploy. Until both are set, the admin denies everyone.

## Security

- **Bot protection:** the enquiry form runs Cloudflare Turnstile (invisible unless a challenge is needed). Passing it issues a short-lived signed session cookie (`lib/security`) that uploads, upload deletion and submission all require; uploads are tied to that session. Workers rate limits are a backstop.
- **Headers** (`next.config.ts`, `proxy.ts`): HSTS, CSP, COOP/CORP, frame denial, nosniff, Permissions-Policy. Public pages are prerendered, so their CSP keeps `'unsafe-inline'` scripts; the admin — which renders patient-supplied text — gets a strict per-request nonce CSP with `'strict-dynamic'`.

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
| `lib/rate-limit.ts` | Workers Rate Limiting bindings (enquiries 5/min, uploads 20/min, bot checks 10/min per IP) |
| `lib/security` | Turnstile verification and the signed visitor session |
| `lib/admin`, `app/coord-*` | Admin auth (Cloudflare Access JWT), data access and pages |
| `lib/notifications` | New-enquiry alert email (Resend) |
| `app/(site)` | Public pages (share the header/footer layout) |

## Content and trust rules

- No fabricated testimonials, statistics, partnerships, accreditations or outcomes. The patient-stories band (labelled empty slots) and metrics are hidden until real content exists (`features.showPatientStoriesPlaceholder` / `features.showMetrics` in `lib/config.ts`).
- Hospitals in `data/hospitals.ts` are **sample data** (`isSample: true`, `isConfirmedPartner: false`): labelled in the UI, `noindex`, and excluded from the sitemap.
- The comparison table uses clearly marked placeholder values.
- No treatment prices are published.

## Production TODOs

- **Admin:** create the Cloudflare Access application and set `CF_ACCESS_TEAM_DOMAIN` / `CF_ACCESS_AUD` (see Admin). Limit Cloudflare account roles to people who need raw D1/R2 access.
- **Email:** confirm `treatvero.com` is verified in Resend (alerts send from `alerts@treatvero.com`).
- **Bot protection:** optionally add a WAF rate-limit rule (Workers rate limits are per location).
- **Cache interception** is disabled in `open-next.config.ts` (it caused an RSC prefetch loop with Next 16.3); re-test before enabling.
- **Payments:** set real prices in `data/pricing.ts`; if using Stripe, add a signature-verified webhook before relying on payment status.
- **CSP:** public pages still allow `'unsafe-inline'` scripts (static prerendering can't carry a nonce); revisit if they ever render user content, and consider CSP reporting.
- **`/from/*` pages** need verified country-specific content before publishing.
