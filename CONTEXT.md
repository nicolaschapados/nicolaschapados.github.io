# Nicolas Chapados' personal site

A static site at chapados.ca presenting Nicolas Chapados' biography, complete publication list, and a blog of research popularizations. Publication data is exported from the private `cv` repository and imported here by a script.

## Language

### Publications

**Publication**:
One bibliographic entry from the CV, identified by its BibTeX key. There are 91.
_Avoid_: paper (too narrow: books, theses and reports are publications too), reference

**Section**:
The CV's grouping of publications, in this fixed display order: books and book chapters, refereed journal articles, refereed conference proceedings, workshop presentations, theses, working papers and technical reports. A publication belongs to exactly one section, set by the CV, not by its BibTeX type. On the site, a seventh section, patents, closes the Publications page.
_Avoid_: category, type (type is the BibTeX entry type, which can disagree with the section)

**Patent**:
One patent family from the CV with its legal status. Patents are listed on the Publications page but are not publications and are not in the manifest; they are hand-maintained site data.

**Archived PDF**:
The copy of a publication stored in the CV repo's archive and served by this site. 13 publications have none; those with a DOI or URL link there, the rest are listed without a link.
_Avoid_: attachment, local PDF

**Manifest**:
The JSON index of all publications generated in the `cv` repo, the sole data source for the publications page.

**Internal report**:
A publication written for an employer or client and not public (today: the five Nortel memoranda and the REITs memorandum, the latter pending client approval). Internal reports stay in the CV and are dropped from the site by BibTeX key; the list is maintained, not permanent.
_Avoid_: confidential, private

**Selected publication**:
One of the eight to ten publications the owner hand-picks for the landing page and the top of the Publications page, each with a one-line note. Not derived from citation counts.
_Avoid_: featured, highlighted, top-cited

**CV sync**:
The one-command import that copies the manifest, archived PDFs and the current CV PDF from the sibling `cv` checkout into this repo.
_Avoid_: build, deploy (those happen on GitHub afterwards)

### Site

**Canonical domain**:
chapados.ca, the one hostname GitHub Pages serves. Every other owned domain redirects to it.
_Avoid_: alias, mirror

**Locale**:
One of the two site languages, `en` or `fr`, each with its own URL prefix and complete chrome. The root redirects to a locale; it is never a page.
_Avoid_: language version, translation (a locale exists even where a post has no translation)

**Section view / Year view**:
The two presentations of the Publications page: grouped by section (default) or one reverse-chronological list with section filters. Same data, toggled by the reader.

**Post**:
A blog entry, written in MDX. Popularizations of research topics are posts, not a separate content type.
_Avoid_: article (reserved for journal publications)
