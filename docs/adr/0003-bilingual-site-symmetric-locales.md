# The site is fully bilingual with symmetric locales /en/ and /fr/

The owner works in Montréal and publishes in both languages, so the whole site (chrome, landing, About, Talks, blog) exists in English and French rather than English with occasional French posts. Locales are symmetric: pages live under `/en/` and `/fr/`, and the bare `chapados.ca` redirects by browser language, then by a remembered switcher choice. Publication titles, venues and PDFs stay in their original language; only the page chrome around them is translated.

## Consequences

- Every piece of site copy is written twice and must be kept in sync; the bio and Talks page are the main maintenance cost.
- A blog post may exist in one language only. The other locale lists it with a language marker and links to the available version; strict parity would slow publishing.
- Absolute URLs always carry a locale prefix; the redirect at `/` means the root itself is never a content page.
