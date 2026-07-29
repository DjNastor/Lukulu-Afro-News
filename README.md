# Lukulu Afro News

A premium, mobile-first Afro House news platform built with React and Vite.

## Features
- Glossy deep-black Lukulu editorial design system
- Premium design polish with cinematic depth, glass navigation, refined cards and mobile luxury details
- Home, stories, new music, charts, events, interviews, culture, about, search, account, submit news and Editorial Studio routes
- Hash routing for GitHub Pages compatibility
- Local demo auth and submission tracking prepared for Firebase / Google Cloud Identity Platform or Supabase Auth
- Editorial Studio role gate and feed/submission review scaffolding
- SEO metadata helpers, JSON-LD, sitemap and robots.txt
- Database schema draft and Google Cloud setup documentation

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Configuration
Copy `.env.example` to `.env.local` and fill only values appropriate for your environment. Never commit real API keys, service account JSON, database credentials or private secrets. See `docs/SETUP.md`.

## Production note
The current repository is a static frontend. Real user auth, uploads, ingestion workers, database persistence, rate limiting and server-side validation require the backend services described in `docs/SETUP.md` and `database/schema.sql`.
