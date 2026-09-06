# chapados.ca

Nicolas Chapados' personal site: biography, publications, talks and blog, in English and French. Built with [Astro](https://astro.build), deployed to GitHub Pages by GitHub Actions. Decisions live in `CONTEXT.md` (glossary) and `docs/adr/`; the spec is [issue #2](https://github.com/nicolaschapados/bio/issues/2).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321/en/
npm run check      # Astro type check
npm test           # production build, then both test seams (tests/)
```

## Update from the CV

Publications, archived PDFs and the CV PDF come from the private `cv` repository. After changing the CV and regenerating its manifest there (`gen_publication_index.py`), run the CV sync, then commit and push the result to `main`:

```sh
npm run cv-sync -- --cv ../cv     # or set CV_REPO
```

The sync reads `publication_details/manifest.json`, drops the keys listed in `scripts/publications.exclude.json` (internal reports), copies new or changed PDFs to `public/papers/`, copies the newest `cv_acad_nc_YYYYMMDD.pdf` to `public/cv.pdf`, and writes `src/data/publications.json`. It never reads the LaTeX source. It fails if the manifest or a referenced PDF is missing.

Hand-maintained data: `src/data/talks.json`, `src/data/patents.json`, `src/data/selected.json` (the selected publications and their one-line notes). Site copy in both languages: `src/i18n/ui.ts`; About pages: `src/content/about/`; posts: `src/content/posts/<locale>/*.mdx`.

## Layout

```
src/
├── content.config.ts     # collections: publications, selected, talks, patents, posts, about
├── i18n/ui.ts            # en/fr strings, locale helpers, social links
├── layouts/Base.astro    # head, alternate links, theme, header, footer
├── pages/index.astro     # root: client-side locale redirect, no-script fallback to /en/
├── pages/[lang]/         # index, about, publications, talks, blog/, rss.xml
└── styles/global.css     # design tokens from docs/design/directions/Main.dc.html
scripts/cv-sync.mjs       # the CV sync
tests/                    # seam 1: built output; seam 2: cv-sync against tests/fixtures/cv
```

## Going live (manual, once)

1. Make this repository public (GitHub Pages on a private repo needs a paid plan).
2. Settings → Pages → Source: GitHub Actions. Merge to `main`; the workflow builds, tests and deploys.
3. Settings → Pages → Custom domain: `chapados.ca` (the `public/CNAME` file matches). Enable "Enforce HTTPS" once the certificate is issued.
4. At Gandi, for `chapados.ca`: four `A` records at the apex pointing to GitHub Pages' IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `CNAME` for `www` to `nicolaschapados.github.io`.
5. Forward the other domains with a permanent (301) redirect to `https://chapados.ca`: `chapadosresearch.org` at Gandi; `portfolioparadigms.com` at Wild West Domains, once the decision on its WordPress posts is made.
