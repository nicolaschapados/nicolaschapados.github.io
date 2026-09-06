# Astro builds the site

The site needs a bespoke look ("professional, fresh and modern, with a touch of academic rigor"), a data-driven publications page, and a blog of research popularizations that may embed interactive figures. Astro was chosen over Hugo and Jekyll al-folio: publications become a typed content collection fed from JSON, blog posts are MDX so posts can carry components, MDX and sitemap are official integrations, RSS comes from the official `@astrojs/rss` helper, and math is rendered at build time with the community `remark-math` and `rehype-katex` plugins. Deployment is a GitHub Actions build on push to `main`, published to GitHub Pages.

## Considered options

- **Hugo**: the owner already built a Hugo site in 2022 and it needs no Node toolchain. Rejected because interactive posts reduce to shortcodes and a component-based bespoke design is more work than in Astro.
- **Jekyll al-folio**: fastest path to an academic site, but every al-folio site looks alike and restyling fights the theme.

## Consequences

- A Node toolchain and lockfile live in the repo; `npm` is used (no pnpm installed).
- The repo must be public before Pages can serve it: GitHub Pages on a private repository requires a paid plan, and `bio` is private today. Git LFS must not be used for the PDFs, since Pages does not serve LFS objects.
- Publication PDFs are committed to the repo and served as static files (the source `cv` repo is private, so raw links would not work).
