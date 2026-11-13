# Verification — 13 November 2026

## Completed locally

- Fresh `npm install`: successful (lockfile included).
- `npm run build`: successful; Vite production client + server build; 28 public routes pre-rendered and two localized not-found screens.
- `npm run lint`: successful with no errors.
- `npm test`: 18 passing tests covering contact validation/provider failures/no false success, bilingual content, all six services, concept attribution, 28 routes, canonical/hreflang/Open Graph and structured data.
- Email tests use a mocked Resend provider and send no real mail.
- Fonts are self-hosted; no remote font/image request is required.
- Browser launch in the execution container is restricted by its socket policy; no local Lighthouse score is claimed. Live browser checks are recorded below after deployment.

## Open configuration

Contact email transport intentionally reports unavailable until server-only Resend credentials and a verified sender are configured. Direct email and WhatsApp links work without a backend configuration. No real delivery claim has been made.

Vercel deployment protection is controlled by the connected account. Public accessibility must be verified after deployment; the official domain/project are untouched.
