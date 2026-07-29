# Lukulu Afro News Setup

## Architecture audit
The existing project was a static Vite + React 18 single page app with hash routing, three source files (`src/main.jsx`, `src/articles.js`, `src/style.css`), no backend, no database, no authentication provider, and no deployment config beyond Vite/GitHub Pages-compatible paths.

## Google Cloud / Firebase
1. Create a Firebase or Google Cloud Identity Platform project.
2. Enable Email/Password and Google sign-in.
3. Put public Firebase values in `.env.local` using `.env.example` names.
4. Store server-only API keys in Secret Manager, not in frontend code.
5. Use Cloud Storage for approved media uploads with MIME and size restrictions.
6. Use Cloud Run or Cloud Functions for feed ingestion, duplicate checks, summaries, scheduled jobs and audit logging.
7. Use Cloud Scheduler to trigger ingestion.
8. Enable GA4 and Search Console after deployment.

## Auth
The current UI includes local demo registration, sign-in, verification state, role gates and submission tracking. Replace localStorage with Firebase Auth / Supabase Auth before production. Editorial Studio must only allow Owner, Administrator, Editor-in-Chief, Editor or Contributor roles.

## News-source integration
Use approved APIs, RSS feeds, YouTube feeds, official embeds, licensed chart data or manually approved sources. Store only headline, source, date, original short summary and external URL unless rights permit more. Imported items must enter draft/review unless the source is explicitly trusted.

## Editorial Studio
Editors can review imported feed drafts, user submissions, trusted sources and export original draft JSON. Production backend should add edit/schedule/archive endpoints, audit logs, version history, newsletters and moderation.

## Deployment
Run `npm install`, `npm run build`, then deploy `dist/` to GitHub Pages, Cloud Run static hosting, Firebase Hosting or Vercel. Keep `VITE_SITE_URL` aligned with the public URL.

## External credentials required
Firebase / Google Cloud Identity Platform, Cloud Storage, Google Programmable Search, GA4, Search Console, Beatport/Traxsource or licensed chart provider APIs, email/newsletter provider, spam/rate-limit provider.

## Security checklist
No secrets in source control; server-side validation; RBAC; protected admin routes; MIME and size checks; rate limiting; spam protection; safe HTML sanitisation; secure cookies/sessions; audit logs; privacy/consent controls; account deletion; attribution and takedown workflow.

## Remaining limitations
This repository is still a static frontend. Real production auth, database persistence, file uploads, scheduled ingestion, email delivery and server-side rate limiting require backend services and credentials.

## Recommended next phase
Implement Firebase/Supabase persistence, Cloud Run ingestion workers, signed Cloud Storage uploads, real editorial approval APIs, sitemap generation at build time and automated tests.
