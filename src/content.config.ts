import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/** CV sections in the CV's fixed display order (see CONTEXT.md, "Section"). */
export const SECTIONS = ['book', 'article', 'refconf', 'workshop', 'thesis', 'techrep'] as const;
export type Section = (typeof SECTIONS)[number];

const publications = defineCollection({
  loader: file('src/data/publications.json'),
  schema: z.object({
    key: z.string(),
    section: z.enum(SECTIONS),
    type: z.string(),
    year: z.number().int(),
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string().nullable(),
    doi: z.string().nullable(),
    url: z.string().nullable(),
    arxiv: z.string().nullable(),
    pdf: z.string().nullable(), // site-relative path under /papers/, or null when no Archived PDF
  }),
});

const selected = defineCollection({
  loader: file('src/data/selected.json'),
  schema: z.object({
    key: z.string(),
    order: z.number().int(),
    note: z.object({ en: z.string(), fr: z.string() }),
  }),
});

const talks = defineCollection({
  loader: file('src/data/talks.json'),
  schema: z.object({
    date: z.string(), // YYYY-MM
    title: z.object({ en: z.string(), fr: z.string() }).or(z.string()),
    event: z.string(),
    place: z.string().nullable(),
    kind: z.enum(['keynote', 'invited', 'lecture', 'panel']).default('invited'),
    with: z.array(z.string()).default([]),
    recording: z.string().url().nullable().default(null),
  }),
});

const patents = defineCollection({
  loader: file('src/data/patents.json'),
  schema: z.object({
    title: z.string(),
    inventors: z.array(z.string()),
    numbers: z.array(z.string()),
    filed: z.number().int(),
    granted: z.number().int().nullable(),
    status: z.object({ en: z.string(), fr: z.string() }),
    url: z.string().url().nullable(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    locale: z.enum(['en', 'fr']),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /** Shared key linking the two language versions of one post. */
    translationKey: z.string(),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/about' }),
  schema: z.object({
    locale: z.enum(['en', 'fr']),
    /** Third-person biography for organizers, shown in a copyable block. */
    thirdPerson: z.string(),
  }),
});

export const collections = { publications, selected, talks, patents, posts, about };
