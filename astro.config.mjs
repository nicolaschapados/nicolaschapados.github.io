// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

// ADR 0001: chapados.ca is canonical. ADR 0003: symmetric locales, root is a redirect we own.
export default defineConfig({
  site: 'https://chapados.ca',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-CA', fr: 'fr-CA' } },
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  markdown: {
    // Astro 7 defaults to the Sätteri processor; we use the unified one so remark-math + rehype-katex apply to Markdown and MDX.
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
  },
});
