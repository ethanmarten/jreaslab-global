# Verification — 13 November 2026

## Build and source checks

- Fresh `npm install`: successful. Lockfile committed.
- Production `npm run build`: successful locally and on Vercel. React SSR pre-rendering produces 28 public routes plus localized not-found screens and a separate noindex maintainer review page.
- `npm run lint`: no errors.
- `npm test`: **18 passed, 0 failed**. Includes validation, missing credentials, provider rejection/timeout, honest acceptance, bilingual content, six required services, concept attribution, 28 routes, canonical/hreflang/Open Graph and structured data.
- All source JavaScript/JSX and styles formatted with Prettier 3.6.2. Native Node imports exercise the real SEO module directly.
- No credentials committed. Outbound mail tests use a mocked provider.

## Deployed HTTP checks

All **28/28** URLs from the production sitemap returned HTTP 200, an H1, canonical and Arabic/English alternates. Details: [http-checks.json](http-checks.json).

Confirmed `robots.txt`, `sitemap.xml` and the original logo respond successfully. An unknown `/ar/no-such-page` returned HTTP **404** after correcting the initial soft-404 fallback. Root redirects to Arabic.

A same-origin contact test with an example.com QA address returned HTTP **503** and `MAIL_NOT_CONFIGURED`. The browser displayed the localized unavailable message and offered direct email/WhatsApp plus an email draft. No success was shown and no real email was sent.

## Browser checks

Inspected the deployed Arabic and English homepages, services, work filtering and concept navigation in Chrome. Arabic/English switch changes content, direction and metadata. Confirmed filter narrowing, process accordion expansion, React navigation into a concept detail page, and the real form fallback.

Mobile menu opened and `aria-expanded` became true; Escape closed it and returned false. Focus trapping, labels, required input validation and skip navigation are implemented. No application error/warning was captured in the final fresh production tab. A stale-chunk error encountered while redeploying was addressed with one guarded preload refresh; temporary audit-tool issues were corrected before final checks.

### Measured viewports and accessibility

Actual same-origin iframe viewports were used; these are browser layout checks, not just resized screenshots. Desktop previews scale visually to fit the inspector while retaining their internal CSS viewport dimensions.

| Page | Viewport | Document scroll width | axe WCAG 2 A/AA + 2.1 AA violations |
|---|---:|---:|---:|
| Arabic home | 360 × 844 | 345 | 0 |
| Arabic home | 390 × 844 | 375 | 0 |
| Arabic home | 768 × 1024 | 753 | 0 |
| Arabic home | 1366 × 768 | 1351 | 0 |
| Arabic home | 1920 × 1080 | 1905 | 0 |
| English home | 390 × 844 | 375 | 0 |
| Arabic contact | 390 × 844 | 375 | 0 |
| English data/AI service detail | 390 × 844 | 375 | 0 |

The 15px difference is the browser scrollbar. None of these documents had horizontal overflow. Raw passing records: [viewport-audits.json](viewport-audits.json), [contact-audit.json](contact-audit.json), [service-audit.json](service-audit.json). During testing, contrast issues in small process labels, a concept illustration and English text on sage backgrounds were found and fixed; the table records passing checks. Automated axe checks cover these pages and rules, not every possible interaction or full accessibility certification.

Screenshots: [desktop.jpg](desktop.jpg) and [mobile.jpg](mobile.jpg). The desktop capture uses the browser's approximately 1363px visible viewport. The mobile image is a clipped screenshot of the actual 360px-wide iframe viewport. The latest screenshots include the light desktop, dark desktop and dark mobile modes.

## Performance limits

No Lighthouse score is claimed. Chromium/Lighthouse cannot launch in the code execution container because its socket policy blocks browser process setup. Live visual and axe checks used the connected browser instead. Initial public pages are pre-rendered and immediately readable; fonts are self-hosted, project visuals are CSS compositions, and motion respects reduced-motion preferences. The large axe runtime is a separate dynamic chunk loaded only on the unlinked maintainer `/__review` page when its audit button is used; it is not required by public pages.

## Configuration still required

The email backend is implemented, but live transport needs a server-only Resend API key and verified sender in the new Vercel project's environment. See [CONTACT_SETUP.md](CONTACT_SETUP.md). The three portfolio studies are original concepts; verified client case studies/images can replace them later.

The new production hostname is publicly reachable. Deployment protection settings were retained; no existing official domain, repository or old hosting project was modified.

## Theme and navigation follow-up

The persistent dark/light implementation passed lint, all 18 tests and the production build. Rechecked Arabic and English homepages at 390px in both themes: zero axe WCAG 2 A/AA and 2.1 AA violations, document width 375px. Arabic at 360px passed in both themes, document width 345px. Checks were taken after transitions settled. No horizontal overflow was observed. The final dark 360px record is [theme-audit-360-dark.json](theme-audit-360-dark.json).

Verified reload persistence, mobile menu and Escape dismissal, language switching and the reference navigation contraction (800 × 62px after scrolling). No fresh production application warnings/errors were captured. See [THEMES_NAVIGATION.md](THEMES_NAVIGATION.md).
