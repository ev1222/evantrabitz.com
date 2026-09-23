# evantrabitz.com

Personal website of Evan Trabitz: a short bio, an index of writing (Essays and Notes), and a link to a resume PDF.
`CLAUDE.md` is a symlink to this file.

## Decisions (made by Evan; don't change without asking)

Only record something here if Evan actually decided it. Claude's own choices go under
**Implementation notes** below, where they can be changed freely.

**Stack and hosting**
- Astro, started from the official blog template (`npm create astro@latest -- --template blog`).
- Hosted on **Cloudflare Workers** (static assets), deployed from GitHub on every push to `main`. Pages is legacy; don't use it.
- Domain registered at Cloudflare Registrar, with DNS in the same Cloudflare account.
- Repo and directory are both named after the domain: `evantrabitz.com`. The GitHub repo is public.

**Design**
- Minimal and text-first, modeled on darioamodei.com: one serif typeface, a narrow reading column, generous line height, almost no chrome.
- **Strip template features rather than adding them.**
- The homepage is a short bio plus an index of writing split into **Essays** and **Notes**.
- Palette: **Eucalyptus & Plum** (chosen from a set of alternatives to the original green/white/pink). Values are under Implementation notes.
- A **light/dark toggle in the top-right corner**.
- Favicon reads "ET".

**Content**
- Posts are Markdown/MDX in content collections, with a `draft` frontmatter flag that excludes a post from builds.
- GFM footnotes styled cleanly; sidenotes are optional.
- Math via `remark-math` + `rehype-katex`; Shiki syntax highlighting.
- An optional `substackUrl` frontmatter field that renders an "Also on Substack" link.

**Features**
- RSS via `@astrojs/rss`; sitemap; canonical URLs and OpenGraph tags.
- **Resume**: maintained in LaTeX in a separate **private** repo. A GitHub Action there (authenticating as a GitHub App, not a PAT) compiles it and commits the PDF here as `public/resume.pdf`. The workflow and its setup must **not** live in this public repo. The homepage link is labelled "Resume".
- About/contact info: GitHub (`github.com/ev1222`), LinkedIn, email, location.
- Comments via Giscus (GitHub Discussions).
- Cloudflare Web Analytics.

## Implementation notes (Claude's choices; change freely)

**Build and hosting**
- Fully static output; no Astro adapter. `wrangler.jsonc` serves `./dist` with no Worker script, `404-page` not-found handling and the default `auto-trailing-slash`. Workers Builds runs `npm run build`, then `npx wrangler deploy`; Node version comes from `.node-version` (22). The Worker is named `evantrabitz`, and `name` in `wrangler.jsonc` must match it.
- The apex custom domain is declared in `wrangler.jsonc` (`routes` → `custom_domain`); `www` → apex is a zone Redirect Rule. Redirects and headers go in `public/_redirects` / `public/_headers`.

**Design**
- Typeface: Source Serif 4, self-hosted via `@fontsource/source-serif-4` and the Astro Fonts API. Column `--measure: 36rem`, line height 1.7. All styling is in `src/styles/global.css`.
- Colors are tokens at the top of `global.css`, each written as `light-dark(light, dark)`. Light: eucalyptus `#EDF0EE` background, `#1A2320` text, `#53605A` secondary, plum `#7B2D5E` accent. Dark: `#121816` background, `#D5DCD8` text, `#8C9893` secondary, orchid `#CF8DB8` accent. The accent passes as text in both modes, so `--accent` and `--accent-text` currently match. Favicon: light "ET" (`#EDF0EE`) on the dark background (`#121816`) with a hairline `#8C9893` border, the same in both modes.
- Theme toggle: `src/components/ThemeToggle.astro`. It follows the OS until clicked. A click sets `<html data-theme>` (which switches `color-scheme`) and stores the choice in `localStorage`, and an inline script in `Base.astro`'s `<head>` applies it before first paint. Shiki uses `defaultColor: false`, so code blocks follow the toggle; Giscus is kept in sync by `postMessage`. The favicon's own dark variant follows the OS, not the toggle.

**Content**
- Posts live in the `writing` collection: `src/content/writing/<slug>.md(x)` → `/writing/<slug>/`. Frontmatter (schema in `src/content.config.ts`): `title`, `description`, `pubDate`, optional `updatedDate`, `kind` (`essay` | `note`, default `note`), `draft` (default `false`), optional `substackUrl`, `comments` (default `true`).
- `draft: true` excludes a post from production builds (pages, homepage index, RSS and sitemap), but drafts still render under `astro dev`. Always go through `getPosts()` in `src/lib/posts.ts`; never call `getCollection('writing')` directly, or drafts will leak.
- Math plugins run through the `unified()` Markdown processor (`@astrojs/markdown-remark`). Astro 7 defaults to Sätteri, which doesn't run remark/rehype plugins, so don't remove `markdown.processor` from `astro.config.mjs`. KaTeX CSS is imported only on post pages. Sidenotes are not implemented.
- Astro's content cache keys entries by file contents, so after a schema change that alters a default, touch the affected posts (or delete `.astro/data-store.json` with the dev server stopped).

**Features**
- `site` is `https://evantrabitz.com` with `trailingSlash: 'always'`; head tags are in `src/components/BaseHead.astro`.
- Resume: bot commits are signed and titled "Update resume (resume@<sha>)". Never hand-edit `public/resume.pdf`; change the LaTeX instead. Nothing reads from the private repo at build time. The homepage link appears only once `public/resume.pdf` exists. `/cv.pdf` 301s to `/resume.pdf` via `public/_redirects`.
- Contact values live in `CONTACT` in `src/consts.ts`; empty values aren't rendered. `hello@evantrabitz.com` needs Cloudflare Email Routing (Compute → Email Service) to receive mail.
- Giscus (`src/components/Giscus.astro`) stays hidden until all of `GISCUS` in `src/consts.ts` is filled in. Per-post opt-out: `comments: false`.
- Web Analytics uses automatic setup on the zone; leave `CF_ANALYTICS_TOKEN` empty unless switching to the manual snippet (never both).

## POSSE workflow (Publish on Own Site, Syndicate Elsewhere)

1. Write the post in `src/content/writing/` with `draft: true`, and preview with `astro dev`.
2. Set the final `pubDate`, flip to `draft: false`, and push to `main`. Workers Builds deploys it. **The site is always the original.**
3. Wait **24–48 hours**, then copy the post **manually** to Substack. At the top or bottom of the Substack version, add a line linking back to the original, e.g. *"Originally published at [evantrabitz.com](https://evantrabitz.com/writing/<slug>/)."* Where Substack allows it, set the canonical URL to the site.
4. Add `substackUrl: <substack post url>` to the post's frontmatter and push, so the site links to the copy.

Don't automate the Substack step, and don't publish on Substack first.

## Development

Node is managed by mise (`~/.local/share/mise/installs/node/latest/bin`). If `node` isn't on PATH in a non-interactive shell, prepend that directory.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

- `npm run build`: static build into `dist/`.
- `npx wrangler dev`: serve `dist/` locally with the same static-asset routing as production (run a build first).

## Documentation

Prefer the Astro docs MCP server (`search_astro_docs`) for up-to-date Astro APIs. This project is on Astro 7, and older examples online are often wrong (for example, top-level `markdown.remarkPlugins` is deprecated).

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles](https://docs.astro.build/en/guides/styling/)
- [Markdown processors and plugins](https://docs.astro.build/en/guides/markdown-content/)
