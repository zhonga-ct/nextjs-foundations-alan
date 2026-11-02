# Third-Party Scripts

Inventory, loading decisions, and measurements for every external script in `apps/web`.

## Inventory

| Script | Owner | Purpose | Loaded by | Strategy | Needed for first interaction? |
| ------ | ----- | ------- | --------- | -------- | ----------------------------- |
| Google Analytics (`googletagmanager.com/gtag/js`) | Marketing / analytics (GA property owner) | Page views and product events | `<GoogleAnalytics>` from `@next/third-parties/google` in `src/app/layout.tsx` | After hydration (component-managed); only rendered when `NEXT_PUBLIC_GA_ID` is set | No |
| Vercel Web Analytics (`/_vercel/insights/script.js`) | Web app maintainers | Privacy-friendly page views | `<Analytics>` from `@vercel/analytics/next` | Deferred, component-managed; debug-only (no requests) in development | No |
| Vercel Speed Insights (`/_vercel/speed-insights/script.js`) | Web app maintainers | Real-user Core Web Vitals (field INP/LCP/CLS) | `<SpeedInsights>` from `@vercel/speed-insights/next` | Deferred, component-managed; debug-only in development | No |

- No `next/script` usages, no `beforeInteractive` scripts, and no remote polyfill services (Polyfill.io or similar) anywhere in `apps/`.
- Fonts are self-hosted by `next/font` (no Google Fonts requests). Gallery images from `picsum.photos` are images, not scripts.
- `NEXT_PUBLIC_GA_ID` is a public measurement ID, not a secret.

## Lab measurements (TBT)

Conditions, identical for every run: production build (`next build` + `next start`), page `/`, Lighthouse 12.8.2 default mobile profile (simulated throttling), headless Chrome on the same Windows machine, `NEXT_PUBLIC_GA_ID=G-TEST123456` (placeholder property) baked in at build time. Five runs each; median reported.

| Run | Analytics | Optional widget | Median TBT | Runs (ms) | Notes |
| --- | --------- | --------------- | ---------: | --------- | ----- |
| Baseline | Hand-rolled `<script>` + inline `gtag` bootstrap | None on the site | 50 ms | 34, 44, 50, 50, 51 | GTM blocking 9–21 ms per run, ~154 KB |
| Isolation | Blocked (`*googletagmanager.com*`) | None | 22 ms | 20, 20, 22, 24, 24 | Third-party cost ≈ 28 ms of TBT |
| Candidate | `@next/third-parties` `<GoogleAnalytics>` | None | 54 ms | 48, 51, 54, 54, 55 | GTM blocking 9–19 ms per run, ~154 KB |

**Result:** the switch to the maintained integration did not measurably change TBT on this page (54 ms vs 50 ms is within run-to-run noise). The gtag payload and its main-thread work are the same either way; the gain is a maintained integration with no hand-written inline bootstrap. If GA's ~28 ms ever matters, the lever is the provider itself (configuration, consent gating, or removal), not the loading wrapper.

To re-run: build with the same placeholder ID, start on a spare port, then run Lighthouse with `--only-categories=performance` (add `--blocked-url-patterns=*googletagmanager.com*` for the isolation run).

## Verification

Checked in the production build on `/` with the placeholder ID:

- One `gtag/js` script tag, one `config` command, one `page_view` collect hit after a hard load.
- After a client-side navigation (`/` → `/about`), still one script and one `config`: no duplicate page view.
- Client-side navigation page views come from GA4 Enhanced Measurement ("page changes based on browser history events"). Confirm it is enabled on the real property, then verify in GA DebugView that each navigation produces exactly one `page_view`.

## Field monitoring (INP)

Lab TBT is a proxy; responsiveness is judged with field INP after deployment:

1. **Vercel Speed Insights** (project sidebar → Speed Insights): Real Experience Score on all plans; per-metric INP (p75, per route, mobile/desktop) with Speed Insights Plus.
2. **Custom web-vitals reporting**: `src/instrumentation-client.ts` posts LCP/INP/CLS to `/api/analytics/vitals` (currently logged server-side; forward to a datastore to chart it).
3. **Chrome UX Report / Search Console**: Google's 28-day field data that affects ranking, once the site has enough traffic.

Target: INP < 200 ms at p75.
