# Sign Pro Kenya Limited Website

A responsive, multi-page business website for a signage, printing and branding company.

## Local development

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env` and update values as needed.
3. Start the server:
   npm start
4. Visit http://localhost:3000

## Production setup

- Terminate TLS at a trusted reverse proxy and configure that proxy to redirect HTTP to HTTPS. Set `NODE_ENV=production`, `SITE_URL=https://signprokenyaltd.co.ke` (or the chosen canonical HTTPS origin), and `TRUST_PROXY_HOPS` to the exact number of trusted proxies in front of this server (usually `1`). Vercel defaults this to one trusted hop; override it only if your proxy topology requires it. Do not expose the app directly if the proxy is intended to provide TLS.
- Configure SMTP credentials through server environment variables. SMTP uses implicit TLS on port 465 and requires STARTTLS on other ports. Enquiries fail explicitly if SMTP is not configured; they are not stored in a database or retained in memory.
- Keep `.env` out of source control. The browser configuration contains only public company contact details; secrets belong in server environment variables.
- The enquiry endpoint validates fields and privacy consent on the server, checks same-origin browser submissions, limits request size to 16 KB, and allows five submissions per IP per 15 minutes. Its default rate-limit store is per process; multi-instance deployments should configure a shared store.

## Application scope

This is a public business website with a quotation form. It has no user accounts, database, administrative pages, pricing engine, or file uploads, so login/password-reset, per-user database isolation, admin authorization, server price recalculation, and upload validation are not applicable. Add those controls if those features are introduced.

## Validation

Run the focused automated checks with `npm test` and check dependency advisories with `npm audit`.
