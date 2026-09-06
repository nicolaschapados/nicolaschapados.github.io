import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sync, toSiteRecords, newestCvPdf, normalizeAuthor } from '../scripts/cv-sync.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureCv = path.join(here, 'fixtures', 'cv');

/** A throwaway site root with the real exclusion-list shape but fixture keys. */
function makeSiteRoot(exclude = ['internal1999']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-'));
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.writeFileSync(path.join(root, 'scripts', 'publications.exclude.json'), JSON.stringify({ exclude }));
  return root;
}

describe('CV sync', () => {
  let siteRoot;
  beforeEach(() => { siteRoot = makeSiteRoot(); });

  it('drops excluded keys, keeps section order, maps PDFs and arXiv ids', () => {
    const s = sync({ cv: fixtureCv, siteRoot, log: () => {} });
    const data = JSON.parse(fs.readFileSync(path.join(siteRoot, 'src/data/publications.json'), 'utf8'));
    expect(s.kept).toBe(3);
    expect(s.excluded).toBe(1);
    expect(data.map((r) => r.key)).toEqual(['book2010', 'beta2020', 'alpha2024']); // book, article, refconf
    expect(data.find((r) => r.key === 'alpha2024').pdf).toBe('/papers/alpha2024.pdf');
    expect(data.find((r) => r.key === 'alpha2024').arxiv).toBe('2401.00001');
    expect(data.find((r) => r.key === 'beta2020').pdf).toBeNull();
    expect(data.some((r) => r.key === 'internal1999')).toBe(false);
  });

  it('copies only non-excluded PDFs, skips unchanged ones on a second run, picks the newest CV', () => {
    const first = sync({ cv: fixtureCv, siteRoot, log: () => {} });
    expect(first.copied.sort()).toEqual(['alpha2024', 'book2010']);
    expect(fs.existsSync(path.join(siteRoot, 'public/papers/internal1999.pdf'))).toBe(false);
    expect(first.cvPdf).toBe('cv_acad_nc_20260905.pdf');
    expect(fs.readFileSync(path.join(siteRoot, 'public/cv.pdf'), 'utf8')).toContain('new cv');
    const second = sync({ cv: fixtureCv, siteRoot, log: () => {} });
    expect(second.copied).toEqual([]);
    expect(second.skipped.sort()).toEqual(['alpha2024', 'book2010']);
  });

  it('fails loudly on a missing manifest and on a missing referenced PDF', () => {
    expect(() => sync({ cv: path.join(os.tmpdir(), 'nope'), siteRoot, log: () => {} })).toThrow(/Manifest not found/);
    const broken = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'));
    fs.cpSync(fixtureCv, broken, { recursive: true });
    fs.unlinkSync(path.join(broken, 'publication_details', 'alpha2024.pdf'));
    expect(() => sync({ cv: broken, siteRoot, log: () => {} })).toThrow(/missing/i);
  });

  it('never touches the tex source and exposes pure helpers', () => {
    expect(newestCvPdf(fixtureCv)).toMatch(/20260905/);
    const recs = toSiteRecords([{ key: 'x', section: 'thesis', type: 'phdthesis', year: '2009', title: 'T', authors: 'A and B', venue: '', pdf: null }], []);
    expect(recs[0].authors).toEqual(['A', 'B']);
    expect(normalizeAuthor('Chapados, Nicolas')).toBe('Nicolas Chapados');
    expect(normalizeAuthor('Boris N. Oreshkin')).toBe('Boris N. Oreshkin');
    expect(toSiteRecords([{ key: 'y', section: 'refconf', type: 'inproceedings', year: 2020, title: 'T', authors: ['Oreshkin, Boris N.', 'Chapados, Nicolas'], pdf: null }], [])[0].authors).toEqual(['Boris N. Oreshkin', 'Nicolas Chapados']);
    expect(recs[0].year).toBe(2009);
    expect(fs.readFileSync(path.join(here, '..', 'scripts', 'cv-sync.mjs'), 'utf8')).not.toMatch(/\.tex/);
  });
});
