import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const sources = JSON.parse(await fs.readFile(new URL('../config/news-sources.json', import.meta.url), 'utf8'));
const outputUrl = new URL('../public/data/live-news.json', import.meta.url);
const relevantTerms = ['afro house', 'afro-house', 'afro electronic', 'afro-electronic', 'afro tech', 'afrotech', 'amapiano', 'gqom', '3step', 'african electronic', 'south africa', 'dj', 'producer', 'remix'];

const decode = (value = '') => value
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&#8217;|&#039;|&apos;/g, "'")
  .replace(/&#8220;|&#8221;|&quot;/g, '"')
  .replace(/&#038;|&amp;/g, '&')
  .replace(/&#8230;/g, '…')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const matchTag = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return decode(match?.[1] || '');
};
const cleanUrl = (url) => {
  try { const parsed = new URL(url); ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach((key) => parsed.searchParams.delete(key)); return parsed.toString(); }
  catch { return url; }
};
const score = (item) => {
  const text = `${item.title} ${item.summary} ${item.categories.join(' ')}`.toLowerCase();
  const matches = relevantTerms.filter((term) => text.includes(term));
  return Math.min(100, 48 + matches.length * 10 + (text.includes('afro house') || text.includes('afro-house') ? 22 : 0));
};
const categorise = (item) => {
  const text = `${item.title} ${item.categories.join(' ')}`.toLowerCase();
  if (/event|festival|tour|show|party|club/.test(text)) return 'Events';
  if (/interview|conversation|profile/.test(text)) return 'Interviews';
  if (/release|single|album|ep|remix|track|music/.test(text)) return 'New Music';
  return 'News';
};

const collected = [];
for (const source of sources.filter((item) => item.enabled && item.type === 'rss')) {
  try {
    const response = await fetch(source.url, { headers: { 'user-agent': 'LukuluAfroNews/1.0 (+https://djnastor.github.io/Lukulu-Afro-News/)' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
    for (const block of blocks.slice(0, 30)) {
      const categories = [...block.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)].map((match) => decode(match[1]));
      const item = {
        id: crypto.createHash('sha256').update(`${source.id}:${matchTag(block, 'guid') || matchTag(block, 'link')}`).digest('hex').slice(0, 16),
        title: matchTag(block, 'title'),
        url: cleanUrl(matchTag(block, 'link')),
        source: source.name,
        sourceHomepage: source.homepage,
        author: matchTag(block, 'dc:creator') || source.name,
        publishedAt: new Date(matchTag(block, 'pubDate') || Date.now()).toISOString(),
        summary: matchTag(block, 'description').slice(0, 280),
        categories,
        importedAt: new Date().toISOString(),
        editorialStatus: source.trusted ? 'trusted-source-draft' : 'review-required',
        attributionRequired: true,
        rights: source.rights,
      };
      item.relevance = score(item);
      item.category = categorise(item);
      if (item.title && item.url && item.relevance >= 68) collected.push(item);
    }
  } catch (error) {
    console.error(`Source ${source.name} failed: ${error.message}`);
  }
}
const unique = [...new Map(collected.map((item) => [item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), item])).values()]
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .slice(0, 24);
const payload = { generatedAt: new Date().toISOString(), policy: 'External headlines and short RSS excerpts only. All items link to and credit the original publisher. Editorial review required.', count: unique.length, items: unique };
await fs.mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await fs.writeFile(outputUrl, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${unique.length} relevant items to public/data/live-news.json`);
