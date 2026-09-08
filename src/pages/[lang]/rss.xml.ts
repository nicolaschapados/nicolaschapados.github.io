import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { blogEnabled, locales, localePath, t, type Locale } from '../../i18n/ui';

export function getStaticPaths() { return blogEnabled ? locales.map((lang) => ({ params: { lang } })) : []; }

export async function GET(context: APIContext) {
  const locale = context.params.lang as Locale;
  const tr = t(locale);
  const posts = (await getCollection('posts', (p) => !p.data.draft && p.data.locale === locale)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${tr('site.name')} · ${tr('blog.title')}`,
    description: tr('blog.intro'),
    site: context.site ?? 'https://chapados.ca',
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.summary, link: localePath(locale, `blog/${p.id.split('/').pop()}`) })),
    customData: `<language>${locale === 'fr' ? 'fr-ca' : 'en-ca'}</language>`,
  });
}
