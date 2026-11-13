# Contact form setup

The React form posts JSON to `/api/contact`. The Vercel Node function validates the request and sends plain-text enquiry mail through Resend. There is no browser-side API key.

## Configure the new Vercel project

1. In Resend, verify a domain you control and complete the DNS records it provides. Use a sender on that verified domain.
2. Open **the new `jreaslab-global` Vercel project → Settings → Environment Variables**. Add these values directly in Vercel:

| Variable | Value | Scope |
| --- | --- | --- |
| `RESEND_API_KEY` | A Resend API key allowed to send from the verified domain | Production; Preview only if enquiry mail should work there |
| `CONTACT_FROM_EMAIL` | A verified sender, for example `Jreas Lab <website@your-verified-domain>` | Same environments as the key |
| `CONTACT_TO_EMAIL` | `info@jreaslab.com`, or another mailbox controlled by the company | Same environments as the key |
| `SITE_URL` | Optional exact origin, such as `https://your-new-project.vercel.app`, without a path | Set separately for each environment if used |
| `VITE_SITE_URL` | The new site's final public origin, without a trailing path | Production build; used for canonical URLs, sharing and sitemap |

3. Redeploy the new project so both server settings and build-time metadata take effect. Do not change the existing Jreas Lab domain or old project.
4. Check that the form gives a clear failure state if configuration is absent. A successful API response is `202` with `status: "accepted"`: Resend accepted the email for sending. This does not prove inbox delivery.
5. When ready for an actual enquiry, submit from the public site's form and check the receiving mailbox and the Resend delivery log. Automated tests mock the provider and never send real mail.

If `SITE_URL` is unset, requests must match the request host's origin. If it is set, requests must match that exact origin. Do not use a production-only `SITE_URL` on changing preview URLs; leave it unset there or configure the matching preview origin.

## Limits and failure states

- Required: name (2–100 characters), email, project type, and description (20–5000 characters). The hidden `website` field must remain empty.
- The recipient is selected on the server. Visitors cannot override it.
- Missing mail settings return `503 MAIL_NOT_CONFIGURED`; provider failure returns `502`; provider timeout returns `504`. No successful result is fabricated.
- Rate limiting is best effort: five valid mail attempts per network address per 15 minutes in each warm function instance. Serverless instances do not share this memory, and a shared proxy may cause addresses to be grouped. Use a shared rate-limit store or a Vercel firewall rate-limit rule before promoting to substantial public traffic.
- Requests have a 16 KB limit, and email provider calls time out after 10 seconds. Names, emails and message bodies are not written to application logs.

## Local development and tests

`npm run dev` and `npm run preview` serve the frontend only. To exercise the function locally, use the Vercel development environment with the server variables configured locally in an ignored `.env` file. Never commit a populated `.env` or prefix secret keys with `VITE_`.

Run `node --test tests/contact.test.js` for isolated API tests. They substitute a fake provider and restore the original environment afterward.
