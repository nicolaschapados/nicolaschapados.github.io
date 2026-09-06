import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Seam 1 (spec, issue #2): assertions on the production build. Run `npm run build` first (npm test does).
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const read = (p) => fs.readFileSync(path.join(dist, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(dist, p));
const publications = JSON.parse(fs.readFileSync(path.join(root, 'src/data/publications.json'), 'utf8'));
const exclude = JSON.parse(fs.readFileSync(path.join(root, 'scripts/publications.exclude.json'), 'utf8')).exclude;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(path.relative(dist, p));
  }
  return out;
}

describe('built site', () => {
  beforeAll(() => { if (!exists('index.html')) throw new Error('dist/ missing: run `npm run build` before the build tests'); });

  it('has an English twin for every French page and vice versa', () => {
    const pages = walk(dist).filter((p) => p.startsWith('en/') || p.startsWith('fr/'));
    const en = pages.filter((p) => p.startsWith('en/')).map((p) => p.slice(3));
    const fr = pages.filter((p) => p.startsWith('fr/')).map((p) => p.slice(3));
    const structural = (p) => !p.startsWith('blog/') || p === 'blog/index.html';
    expect(en.filter(structural).sort()).toEqual(fr.filter(structural).sort());
    expect(en).toContain('publications/index.html');
    expect(en).toContain('talks/index.html');
    expect(en).toContain('about/index.html');
  });

  it('root redirects by language with a no-script fallback to /en/', () => {
    const html = read('index.html');
    expect(html).toMatch(/location\.replace/);
    expect(html).toMatch(/navigator\.language/);
    expect(html).toMatch(/<noscript><meta http-equiv="refresh" content="0; url=\/en\/"/);
    expect(html).toContain('hreflang="fr-CA"');
  });

  it('sets lang and alternate links per locale', () => {
    expect(read('en/index.html')).toMatch(/<html lang="en-CA"/);
    expect(read('fr/index.html')).toMatch(/<html lang="fr-CA"/);
    expect(read('en/publications/index.html')).toContain('hreflang="fr-CA" href="https://chapados.ca/fr/publications/"');
  });

  for (const locale of ['en', 'fr']) {
    it(`${locale}: renders every non-excluded publication once per view, in section order, owner in bold`, () => {
      const html = read(`${locale}/publications/index.html`);
      const keys = [...html.matchAll(/data-key="([^"]+)"/g)].map((m) => m[1]);
      const inSectionView = html.split('data-view-panel="year"')[0];
      const sectionKeys = [...inSectionView.matchAll(/data-key="([^"]+)"/g)].map((m) => m[1]);
      // Section view = selected block + every publication once; year view = every publication once.
      const selectedCount = JSON.parse(fs.readFileSync(path.join(root, 'src/data/selected.json'), 'utf8')).length;
      expect(sectionKeys.length).toBe(publications.length + selectedCount);
      expect(keys.length).toBe(publications.length * 2 + selectedCount);
      for (const k of exclude) expect(html).not.toContain(`data-key="${k}"`);
      const order = ['id="book"', 'id="article"', 'id="refconf"', 'id="workshop"', 'id="thesis"', 'id="techrep"', 'id="patents"'].map((s) => html.indexOf(s));
      expect(order.every((i) => i > 0)).toBe(true);
      expect([...order].sort((a, b) => a - b)).toEqual(order);
      expect(html).toContain('<strong>Nicolas Chapados</strong>');
      expect(html).not.toMatch(/data-key="[^"]*"[^]*?<strong>Nicolas<\/strong>/);
    });
  }

  it('every PDF link resolves to a file in dist, and every archived publication has one', () => {
    const html = read('en/publications/index.html');
    const hrefs = [...new Set([...html.matchAll(/href="(\/papers\/[^"]+)"/g)].map((m) => m[1]))];
    expect(hrefs.length).toBe(publications.filter((p) => p.pdf).length);
    for (const h of hrefs) expect(exists(h.slice(1)), h).toBe(true);
    expect(exists('cv.pdf')).toBe(true);
    for (const p of publications.filter((p) => !p.pdf)) expect(html).not.toContain(`/papers/${p.key}.pdf`);
  });

  it('publishes an RSS feed per locale with one item per post in that locale', () => {
    for (const locale of ['en', 'fr']) {
      const xml = read(`${locale}/rss.xml`);
      expect(xml).toMatch(/^<\?xml/);
      const posts = fs.readdirSync(path.join(root, 'src/content/posts', locale)).filter((f) => f.endsWith('.mdx')).length;
      expect((xml.match(/<item>/g) ?? []).length).toBe(posts);
      expect(xml).toContain(`https://chapados.ca/${locale}/blog/`);
    }
  });

  it('sitemap lists locale pages and not the 404', () => {
    const index = read('sitemap-index.xml');
    const parts = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path.basename(new URL(m[1]).pathname));
    const urls = parts.map((p) => read(p)).join('');
    expect(urls).toContain('https://chapados.ca/en/publications/');
    expect(urls).toContain('https://chapados.ca/fr/publications/');
    expect(urls).not.toContain('/404/');
  });

  it('contains no plain mailto and no phone number', () => {
    const all = walk(dist).map(read).join('\n');
    expect(all).not.toMatch(/href="mailto:/);
    expect(all).not.toMatch(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/);
  });
});
