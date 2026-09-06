import type { CollectionEntry } from 'astro:content';

type Pub = CollectionEntry<'publications'>['data'];

const TYPE_MAP: Record<string, string> = {
  book: 'book', article: 'article', refconf: 'inproceedings', workshop: 'inproceedings', thesis: 'phdthesis', techrep: 'techreport',
};

/** BibTeX generated from the manifest fields (see spec: the sync stays a pure manifest consumer). */
export function toBibtex(p: Pub): string {
  const type = p.type && p.type !== 'unknown' ? p.type.toLowerCase() : TYPE_MAP[p.section] ?? 'misc';
  const fields: [string, string | null][] = [
    ['title', `{${p.title}}`],
    ['author', p.authors.join(' and ')],
    ['year', String(p.year)],
  ];
  if (p.venue) fields.push([type === 'article' ? 'journal' : type === 'inproceedings' ? 'booktitle' : type === 'phdthesis' || type === 'mastersthesis' ? 'school' : 'howpublished', p.venue]);
  if (p.doi) fields.push(['doi', p.doi]);
  if (p.url) fields.push(['url', p.url]);
  const body = fields.filter(([, v]) => v).map(([k, v]) => `  ${k} = {${v}},`).join('\n');
  return `@${type}{${p.key},\n${body}\n}`;
}

export function authorsHtml(authors: string[], me = 'Nicolas Chapados'): string {
  return authors.map((a) => (a.trim() === me ? `<strong>${a}</strong>` : escape(a))).join(', ');
}

function escape(s: string) { return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!); }
