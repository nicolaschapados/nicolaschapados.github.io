export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'site.name': 'Nicolas Chapados',
    'site.tagline': 'Machine learning · Forecasting · Enterprise AI',
    'site.description': 'Nicolas Chapados: machine learning researcher and company builder. Biography, publications, talks and blog.',
    'nav.about': 'About',
    'nav.publications': 'Publications',
    'nav.talks': 'Talks',
    'nav.blog': 'Blog',
    'nav.cv': 'CV · PDF',
    'nav.home': 'Home',
    'lang.switch': 'Français',
    'lang.other': 'fr',
    'theme.toggle': 'Toggle light or dark theme',
    'hero.title.a': 'Building learning machines, ',
    'hero.title.b': 'then the companies around them.',
    'hero.lede': 'Co-founder and Chief Scientist at Nera Software. Adjunct Professor at Polytechnique Montréal and Associate Industry Member of Mila. Previously VP Research at ServiceNow. Co-founder of Element AI, Imagia, ApSTAT and Chapados Couture Capital.',
    'hero.bio': 'Biography',
    'home.selected': 'Selected work',
    'home.blog': 'From the blog',
    'home.speaking': 'Speaking',
    'home.allPublications': 'All publications',
    'home.allPosts': 'All posts',
    'home.allTalks': 'All talks',
    'home.noPost': 'First post coming soon.',
    'pub.title': 'Publications',
    'pub.intro': 'Every public publication from the academic CV, with archived PDFs where available. Titles and venues are shown in their original language.',
    'pub.view.section': 'By section',
    'pub.view.year': 'By year',
    'pub.search': 'Filter by title or author',
    'pub.pdf': 'PDF',
    'pub.doi': 'DOI',
    'pub.arxiv': 'arXiv',
    'pub.link': 'Link',
    'pub.bibtex': 'BibTeX',
    'pub.copied': 'Copied',
    'pub.selected': 'Selected publications',
    'pub.count': 'publications',
    'section.book': 'Books and book chapters',
    'section.article': 'Refereed journal articles',
    'section.refconf': 'Refereed conference proceedings',
    'section.workshop': 'Workshop presentations',
    'section.thesis': 'Theses',
    'section.techrep': 'Working papers and technical reports',
    'section.patent': 'Patents',
    'patent.status': 'Status',
    'talks.title': 'Invited talks',
    'talks.intro': 'Keynotes, invited talks and guest lectures, most recent first.',
    'talks.recording': 'Recording',
    'talks.with': 'with',
    'blog.title': 'Blog',
    'blog.intro': 'Notes and popularizations on machine learning, forecasting and enterprise AI.',
    'blog.otherLocale': 'This post is available in French only.',
    'blog.readIn': 'Read in French',
    'blog.discuss': 'Discuss this post on',
    'blog.rss': 'RSS feed',
    'blog.minutes': 'min read',
    'about.title': 'About',
    'about.forOrganizers': 'Short biography for organizers',
    'about.copy': 'Copy',
    'footer.email': 'Email',
    'footer.rights': 'Nicolas Chapados',
    'footer.place': 'Montréal',
    'notfound.title': 'Page not found',
    'notfound.body': 'Nothing lives at this address. The home page is a good place to start again.',
  },
  fr: {
    'site.name': 'Nicolas Chapados',
    'site.tagline': 'Apprentissage automatique · Prévision · IA d’entreprise',
    'site.description': 'Nicolas Chapados : chercheur en apprentissage automatique et bâtisseur d’entreprises. Biographie, publications, conférences et blogue.',
    'nav.about': 'À propos',
    'nav.publications': 'Publications',
    'nav.talks': 'Conférences',
    'nav.blog': 'Blogue',
    'nav.cv': 'CV · PDF',
    'nav.home': 'Accueil',
    'lang.switch': 'English',
    'lang.other': 'en',
    'theme.toggle': 'Basculer entre le thème clair et le thème sombre',
    'hero.title.a': 'Construire des machines qui apprennent, ',
    'hero.title.b': 'puis les entreprises qui les entourent.',
    'hero.lede': 'Cofondateur et chef scientifique de Nera Software. Professeur associé à Polytechnique Montréal et membre industriel associé de Mila. Auparavant vice-président à la recherche chez ServiceNow. Cofondateur d’Element AI, d’Imagia, d’ApSTAT et de Chapados Couture Capital.',
    'hero.bio': 'Biographie',
    'home.selected': 'Travaux choisis',
    'home.blog': 'Sur le blogue',
    'home.speaking': 'Conférences',
    'home.allPublications': 'Toutes les publications',
    'home.allPosts': 'Tous les billets',
    'home.allTalks': 'Toutes les conférences',
    'home.noPost': 'Premier billet à venir.',
    'pub.title': 'Publications',
    'pub.intro': 'Toutes les publications publiques du CV académique, avec les PDF archivés lorsqu’ils existent. Les titres et les lieux de publication sont dans leur langue d’origine.',
    'pub.view.section': 'Par section',
    'pub.view.year': 'Par année',
    'pub.search': 'Filtrer par titre ou auteur',
    'pub.pdf': 'PDF',
    'pub.doi': 'DOI',
    'pub.arxiv': 'arXiv',
    'pub.link': 'Lien',
    'pub.bibtex': 'BibTeX',
    'pub.copied': 'Copié',
    'pub.selected': 'Publications choisies',
    'pub.count': 'publications',
    'section.book': 'Livres et chapitres de livres',
    'section.article': 'Articles de revues avec comité de lecture',
    'section.refconf': 'Actes de conférences avec comité de lecture',
    'section.workshop': 'Présentations en atelier',
    'section.thesis': 'Thèses',
    'section.techrep': 'Documents de travail et rapports techniques',
    'section.patent': 'Brevets',
    'patent.status': 'Statut',
    'talks.title': 'Conférences invitées',
    'talks.intro': 'Conférences plénières, présentations invitées et cours magistraux, du plus récent au plus ancien.',
    'talks.recording': 'Enregistrement',
    'talks.with': 'avec',
    'blog.title': 'Blogue',
    'blog.intro': 'Notes et vulgarisation sur l’apprentissage automatique, la prévision et l’IA d’entreprise.',
    'blog.otherLocale': 'Ce billet n’existe qu’en anglais.',
    'blog.readIn': 'Lire en anglais',
    'blog.discuss': 'Discuter de ce billet sur',
    'blog.rss': 'Fil RSS',
    'blog.minutes': 'min de lecture',
    'about.title': 'À propos',
    'about.forOrganizers': 'Courte biographie pour les organisateurs',
    'about.copy': 'Copier',
    'footer.email': 'Courriel',
    'footer.rights': 'Nicolas Chapados',
    'footer.place': 'Montréal',
    'notfound.title': 'Page introuvable',
    'notfound.body': 'Rien n’habite à cette adresse. La page d’accueil est un bon point de départ.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['en'];

export function t(locale: Locale) {
  return (key: UiKey): string => ui[locale][key] ?? ui.en[key];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'fr' : 'en';
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'fr';
}

/** Build a site-relative URL for a locale. Paths always end with a slash (trailingSlash: 'always'). */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export const social = {
  scholar: 'https://scholar.google.com/citations?user=QdnjDj8AAAAJ',
  linkedin: 'https://www.linkedin.com/in/nicolaschapados/',
  bluesky: 'https://bsky.app/profile/nicolaschapados.bsky.social',
  x: 'https://x.com/NicolasChapados',
  github: 'https://github.com/nicolaschapados',
  openreview: 'https://openreview.net/profile?id=~Nicolas_Chapados1',
} as const;

/** Email is assembled client-side from these parts so it is never a plain mailto in the HTML. */
export const emailParts = { user: 'nicolas', domain: 'chapados.ca' } as const;
