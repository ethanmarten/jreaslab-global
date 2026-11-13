# Jreas Lab — Global Digital Studio

A new, Arabic-first studio website built from scratch with React and Vite. Complete English equivalents, full RTL/LTR layouts, six service detail pages, original concept case studies, a secure contact endpoint, and pre-rendered public pages.

**Live deployment:** https://jreaslab-global.vercel.app/ar  
**Repository:** https://github.com/ethanmarten/jreaslab-global

The original repository and official domain remain separate. Original branding is retained. No unverified client lists, statistics, testimonials or office claims are used.

## Run locally

Requires Node.js 22.12+ and npm.

```bash
npm install
npm run dev
```

```bash
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

Vite local preview serves the frontend only. The `/api/contact` function requires the Vercel runtime (`vercel dev`) or a Vercel deployment; missing configuration never produces a success message.

## Architecture

- React 19 / JavaScript / JSX / Vite 7, React Router 7
- CSS Modules for header and hero; shared CSS tokens and component styles
- Motion for React, native smooth anchors, reduced-motion support
- Lucide icons; i18next and react-i18next
- Self-hosted IBM Plex Sans Arabic and DM Sans via Fontsource
- Vite SSR build and React server rendering at build time; HTML output is generated from React, never maintained as separate HTML pages
- Node.js serverless contact handler for Resend on Vercel

`src/components/layout` contains navigation and shell components; `sections` contains reusable home and service modules; `ui` contains shared controls and original project compositions. Content lives in `src/data`, interface translations in `src/i18n/resources.js`. Pages are in `src/pages`. `scripts/prerender.mjs` generates all public routes, sitemap and robots files. Project details are code split.

## Routes

| Arabic | English | Content |
|---|---|---|
| `/ar` | `/en` | Home |
| `/ar/services` | `/en/services` | All six services |
| `/ar/services/:slug` | `/en/services/:slug` | Six service detail pages |
| `/ar/work` | `/en/work` | Filterable concepts |
| `/ar/work/:slug` | `/en/work/:slug` | Three concept case studies |
| `/ar/about` | `/en/about` | Studio and process |
| `/ar/contact` | `/en/contact` | Contact form and direct channels |

`/` redirects to `/ar` on Vercel and through React Router locally. 28 public routes are pre-rendered, plus two localized not-found screens.

Service slugs: `web-development`, `mobile-apps`, `ui-ux`, `branding`, `digital-marketing`, `data-ai`.

## Content and brand editing

1. Update service and concept data in both languages together.
2. Change interface copy in `src/i18n/resources.js`.
3. Tokens in `src/styles/global.css`; hero/header styling in their CSS Modules.
4. All three showcased projects are explicitly labelled original **design concepts**, not client commissions. Replace them with verified, approved case studies when available; preserve honest attribution and evidence for outcomes.
5. Brand provenance and reference research: [docs/RESEARCH.md](docs/RESEARCH.md). Original logo vector is from the existing Jreas Lab identity site; the light-background version changes only the white wordmark colour. The favicon crops the original symbol's viewBox.

## Contact delivery

See [docs/CONTACT_SETUP.md](docs/CONTACT_SETUP.md). Copy `.env.example` for local development; production values belong in Vercel project environment settings. Never prefix mail secrets with `VITE_` or commit them.

- POST `/api/contact`; validates required fields, bounded payload, email, allowed project types and language.
- Same-origin checks, honeypot, best-effort per-instance throttling, provider timeout.
- Missing mail credentials returns HTTP 503 and an honest fallback with direct email/WhatsApp.
- HTTP 202 confirms provider acceptance, not final inbox delivery.
- No enquiry content or credentials are logged. No database retention, marketing signup or third-party analytics is configured.
- For significant public traffic, add a shared rate-limit store or Vercel firewall rule. In-memory throttling is not global across instances.

## SEO

Each public route has a pre-rendered title, description, canonical, Arabic/English hreflang, Open Graph, Twitter card and Organization JSON-LD without fabricated ratings. The default canonical origin is the **new** Vercel hostname. If moving to a final domain, configure `VITE_SITE_URL` and rebuild; existing official DNS is not changed by this repository. `SITE_URL` separately controls the contact endpoint's allowed production origin.

Unknown paths render a not-found screen. Test platform HTTP status and routing after each hosting configuration change; local Vite preview uses its own SPA fallback.

## Deploy to Vercel

Import this repository as a **new** Vite project. Branch `main`, build `npm run build`, output `dist`, Node 22.x. `vercel.json` includes root redirect, clean paths, headers and localized not-found fallbacks. The serverless `api/contact.js` deploys with the frontend, so a separate paid backend is not required. Do not repoint the existing official domain without a separate decision.

## Verification

- `npm install`, `npm run build`, `npm run lint`, `npm test`.
- Tests stub outbound email and never send real enquiries.
- Validation notes and actual browser/Lighthouse results are recorded in [docs/QA.md](docs/QA.md). Scores are reported only when measured.

## Asset rights

Brand assets belong to Jreas Lab. No reference-site images, code or brand assets were copied. Three concept interface illustrations are original CSS compositions; dashboard figures are sample data. Font licenses are bundled by their Fontsource packages (IBM Plex OFL, DM Sans OFL); Lucide uses ISC, Motion MIT. This repository does not grant ownership of Jreas Lab trademarks to third parties.

A separate, unlinked `/__review` page provides 360/390/768/1366/1920px iframe viewports and an on-demand axe accessibility check for maintainers. It is noindex, excluded from the sitemap, and its audit code is loaded separately from the public website. It contains no privileged tools or private data.
