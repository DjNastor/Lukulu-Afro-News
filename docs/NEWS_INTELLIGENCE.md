# Lukulu AI Intelligence Desk

The Intelligence Desk is designed to discover Afro House signals from approved, legal sources while keeping editors in control.

## Approved source types
- Google Programmable Search / approved Google APIs
- Google News-compatible RSS feeds
- Official music publication RSS feeds
- YouTube channel feeds
- Artist, label and promoter websites with RSS/API/explicit permission
- Public press-release feeds
- Official social embeds or API-authorised social data
- Manually added external links from editors

## Rules
- Do not bypass paywalls, login walls, robots restrictions or platform terms.
- Do not copy complete third-party articles.
- Store headline, source, date, original short summary, image if licensed/allowed, and external URL.
- Generate Lukulu’s own short summary and route all imports into drafts.
- Require editorial approval unless the source is explicitly trusted.
- Keep source attribution visible on every external item.
- Detect duplicates, broken links, spam and low-quality content.

## Social media
Social content should come from official APIs, embeds, public creator announcements, or manually approved links. Production integrations require platform credentials and must respect each platform’s terms.

## AI processing pipeline
1. Collect from approved feed/API/source.
2. Normalise title, source, date, author, image, category and link.
3. Score Afro House relevance.
4. Detect duplicates.
5. Generate an original summary.
6. Assign tags.
7. Save as editorial draft.
8. Require editor review.
9. Publish only with attribution and policy checks.


## Live feed implementation
- `config/news-sources.json` is the allowlist of approved feeds.
- `scripts/fetch-news.mjs` downloads RSS metadata, strips HTML, scores relevance, detects duplicate headlines and writes `public/data/live-news.json`.
- `.github/workflows/refresh-news.yml` refreshes every six hours and republishes GitHub Pages.
- The initial live source is EARMILK's publisher-provided Afro House search RSS feed.
- Google News RSS is not used because its displayed terms restrict use to personal, non-commercial feed readers.
