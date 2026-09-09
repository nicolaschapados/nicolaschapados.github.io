#!/usr/bin/env node
// CV sync (see CONTEXT.md): import publications, Archived PDFs and the current CV PDF
// from the sibling `cv` checkout into this repo. Reads only the manifest and PDFs, never the tex.
//
//   npm run cv-sync -- --cv ../cv          (default: $CV_REPO or ../cv)
//   npm run cv-sync -- --cv ../cv --dry-run
//
// Exits non-zero when the manifest is missing or a referenced PDF does not exist.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SECTION_ORDER = ['book', 'article', 'refconf', 'workshop', 'thesis', 'techrep'];

export function parseArgs(argv) {
  const out = { cv: process.env.CV_REPO ?? '../cv', dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cv') out.cv = argv[++i];
    else if (argv[i] === '--dry-run') out.dryRun = true;
  }
  return out;
}

/** Extract an arXiv id from a manifest record's url/note fields, if any. */
export function arxivId(record) {
  const hay = [record.url, record.note, record.source_url].filter(Boolean).join(' ');
  const m = hay.match(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)/i) || hay.match(/arXiv:([0-9]{4}\.[0-9]{4,5})/i);
  return m ? m[1] : null;
}

/** Remove LaTeX residue the manifest cleaner leaves behind: accents like \\'E or \\"u, \\c{c}, and stray braces. */
export function deLatex(s) {
  const marks = { "'": '\u0301', '`': '\u0300', '^': '\u0302', '"': '\u0308', '~': '\u0303', '=': '\u0304', '.': '\u0307', 'v': '\u030c', 'u': '\u0306', 'H': '\u030b', 'c': '\u0327', 'k': '\u0328', 'r': '\u030a' };
  return String(s)
    .replace(/\\([`'^"~=.])\{?([A-Za-z])\}?/g, (_, m, ch) => (ch + marks[m]).normalize('NFC'))
    .replace(/\\([vuHckr])\{([A-Za-z])\}/g, (_, m, ch) => (ch + marks[m]).normalize('NFC'))
    .replace(/\\i\b/g, 'ı').replace(/\\ss\b/g, 'ß').replace(/\\o\b/g, 'ø').replace(/\\O\b/g, 'Ø').replace(/\\ae\b/g, 'æ').replace(/\\oe\b/g, 'œ')
    .replace(/\\(?:emph|textit|textbf|text|mathrm|mbox)\{([^{}]*)\}/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "Last, First" → "First Last", LaTeX residue removed; anything else unchanged. */
export function normalizeAuthor(a) {
  const parts = deLatex(a).split(',').map((x) => x.trim()).filter(Boolean);
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : deLatex(a);
}

/** Turn manifest records into the site's publications.json records. Pure. */
export function toSiteRecords(records, exclude) {
  const dropped = new Set(exclude);
  return records
    .filter((r) => !dropped.has(r.key))
    .map((r) => ({
      id: r.key,
      key: r.key,
      section: r.section,
      type: r.type,
      year: Number(r.year),
      title: deLatex(r.title),
      authors: (Array.isArray(r.authors) ? r.authors : String(r.authors ?? '').split(/\s+and\s+|;\s*/)).map(normalizeAuthor).filter(Boolean),
      venue: r.venue ? deLatex(r.venue) : null,
      doi: r.doi || null,
      url: r.url || r.source_url || null,
      arxiv: arxivId(r),
      pdf: r.pdf ? `/papers/${r.key}.pdf` : null,
    }))
    .sort((a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) || b.year - a.year || a.title.localeCompare(b.title));
}

/**
 * Newest public-approved CV: cv_acad_nc_YYYYMMDD_public.pdf (the `_public` suffix marks the release cleared
 * for publication; the unsuffixed file carries private contact details and is never copied).
 * Dated files win by date; an undated cv_acad_nc_public.pdf is used only when no dated one exists.
 */
export function newestCvPdf(dir) {
  const names = fs.readdirSync(dir);
  const dated = names.filter((n) => /^cv_acad_nc_\d{8}_public\.pdf$/.test(n)).sort();
  if (dated.length) return path.join(dir, dated[dated.length - 1]);
  return names.includes('cv_acad_nc_public.pdf') ? path.join(dir, 'cv_acad_nc_public.pdf') : null;
}

function sameFile(a, b) {
  if (!fs.existsSync(b)) return false;
  const sa = fs.statSync(a), sb = fs.statSync(b);
  return sa.size === sb.size && sb.mtimeMs >= sa.mtimeMs;
}

export function sync({ cv, siteRoot, dryRun = false, log = console.log }) {
  const manifestPath = path.join(cv, 'publication_details', 'manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`Manifest not found: ${manifestPath}. Pull the cv repo or pass --cv <path>.`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const records = manifest.records ?? manifest;
  const excludePath = path.join(siteRoot, 'scripts', 'publications.exclude.json');
  const exclude = JSON.parse(fs.readFileSync(excludePath, 'utf8')).exclude;

  const site = toSiteRecords(records, exclude);
  const papersDir = path.join(siteRoot, 'public', 'papers');
  const summary = { total: records.length, excluded: records.length - site.length, kept: site.length, copied: [], skipped: [], missing: [] };

  for (const r of records) {
    if (exclude.includes(r.key) || !r.pdf) continue;
    const src = path.join(cv, r.pdf);
    if (!fs.existsSync(src)) { summary.missing.push(r.pdf); continue; }
    const dst = path.join(papersDir, `${r.key}.pdf`);
    if (sameFile(src, dst)) { summary.skipped.push(r.key); continue; }
    if (!dryRun) { fs.mkdirSync(papersDir, { recursive: true }); fs.copyFileSync(src, dst); }
    summary.copied.push(r.key);
  }
  if (summary.missing.length) throw new Error(`Referenced PDFs missing in cv repo: ${summary.missing.join(', ')}`);

  const cvPdf = newestCvPdf(cv);
  if (!cvPdf) throw new Error(`No public-approved CV (cv_acad_nc_YYYYMMDD_public.pdf) found in ${cv}`);
  const cvDst = path.join(siteRoot, 'public', 'cv.pdf');
  summary.cvPdf = path.basename(cvPdf);
  if (!dryRun && !sameFile(cvPdf, cvDst)) fs.copyFileSync(cvPdf, cvDst);

  const dataPath = path.join(siteRoot, 'src', 'data', 'publications.json');
  if (!dryRun) { fs.mkdirSync(path.dirname(dataPath), { recursive: true }); fs.writeFileSync(dataPath, JSON.stringify(site, null, 2) + '\n'); }

  log(`cv-sync: ${summary.kept} publications kept (${summary.excluded} excluded of ${summary.total}); ${summary.copied.length} PDFs copied, ${summary.skipped.length} unchanged; CV ${summary.cvPdf}${dryRun ? ' [dry run]' : ''}`);
  return summary;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try { sync({ cv: path.resolve(args.cv), siteRoot, dryRun: args.dryRun }); }
  catch (e) { console.error(`cv-sync failed: ${e.message}`); process.exit(1); }
}
