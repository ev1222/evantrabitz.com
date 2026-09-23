# evantrabitz.com

Personal website of Evan Trabitz: a short bio, an index of writing (Essays and Short posts), and a link to a CV PDF.
`CLAUDE.md` is a symlink to this file.

## Decisions (settled — don't relitigate without asking)

**Stack and hosting**
- Astro 7, started from the official blog template (`npm create astro@latest -- --template blog`), fully static output. No adapter.
- Hosted on **Cloudflare Pages**, deployed from GitHub on every push to `main`. Build command `npm run build`, output `dist`, Node version from `.node-version` (22).
- Domain registered at Cloudflare Registrar; DNS lives in the same Cloudflare account, so the custom domain is attached from the Pages project.
- Repo and directory are both named after the domain: `evantrabitz.com`.

**Design**
- Minimal and text-first, modeled on darioamodei.com: **one serif typeface** (Source Serif 4, self-hosted via `@fontsource/source-serif-4` and the Astro Fonts API), a narrow reading column (`--measure: 36rem`), generous line height (1.7), almost no chrome. Light/dark follow the OS; no toggle.
- The homepage is a short bio plus an index of writing split into **Essays** and **Short posts**.
- **Strip template features rather than adding them.** No hero images, OG image generation, nav bars, social icons, JS widgets, or client-side frameworks unless explicitly asked for. All styling is in `src/styles/global.css`.

**Content**
- Posts are Markdown or MDX in the `writing` content collection: `src/content/writing/<slug>.md(x)` → `/writing/<slug>/`.
- Frontmatter (schema in `src/content.config.ts`): `title`, `description`, `pubDate`, optional `updatedDate`, `kind` (`essay` | `short`, default `short`), `draft` (default `false`), optional `substackUrl`, `comments` (default `true`).
- `draft: true` excludes a post from production builds — pages, homepage index, RSS, and sitemap. Drafts still render under `astro dev`. Always go through `getPosts()` in `src/lib/posts.ts`; never call `getCollection('writing')` directly, or drafts will leak.
- `substackUrl` renders an "Also on Substack" link at the end of the post.
- GFM footnotes are styled in `global.css` (`.footnotes`). Sidenotes are optional and not implemented.
- Math: `remark-math` + `rehype-katex`, which run through the `unified()` Markdown processor (`@astrojs/markdown-remark`). Astro 7 defaults to Sätteri, which doesn't run remark/rehype plugins, so don't remove `markdown.processor` from `astro.config.mjs`. KaTeX CSS is imported only on post pages.
- Syntax highlighting: Shiki, dual `github-light`/`github-dark` themes switched by `prefers-color-scheme`.

**Features**
- RSS at `/rss.xml` (`@astrojs/rss`); sitemap via `@astrojs/sitemap`; canonical URLs and OpenGraph tags in `src/components/BaseHead.astro`. `site` is `https://evantrabitz.com` with `trailingSlash: 'always'`.
- **CV**: the resume is maintained in LaTeX in the separate **private** repo `ev1222/resume`. That repo's GitHub Action (template: `docs/resume-repo-workflow.yml`) compiles it and commits the PDF here as `public/cv.pdf`. It authenticates as a GitHub App installed only on this repo (short-lived tokens, no PAT), and commits through the GraphQL API so the commits are signed and "Verified". The commit triggers a normal Pages deploy, so this repo has no TeX toolchain and no HTML CV page. Never hand-edit `public/cv.pdf`; change the LaTeX instead. Don't add anything that reads from `ev1222/resume` at build time; the one-way push keeps the Pages build free of credentials. The homepage "CV" link appears only once `public/cv.pdf` exists.
- Contact: GitHub `github.com/ev1222`, plus LinkedIn, email, and location. All are set in `CONTACT` in `src/consts.ts`; empty values aren't rendered.
- **Comments**: Giscus (GitHub Discussions), `src/components/Giscus.astro`. It stays hidden until all of `GISCUS` in `src/consts.ts` is filled in. Per-post opt-out: `comments: false`.
- **Analytics**: Cloudflare Web Analytics. Either enable it in the Pages dashboard (auto-injected) or set `CF_ANALYTICS_TOKEN` in `src/consts.ts`; the beacon is only emitted in production builds. Don't do both.

## POSSE workflow (Publish on Own Site, Syndicate Elsewhere)

1. Write the post in `src/content/writing/` with `draft: true`, and preview with `astro dev`.
2. Set the final `pubDate`, flip to `draft: false`, and push to `main`. Cloudflare Pages deploys it. **The site is always the original.**
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

## Documentation

Prefer the Astro docs MCP server (`search_astro_docs`) for up-to-date Astro APIs. This project is on Astro 7, and older examples online are often wrong (for example, top-level `markdown.remarkPlugins` is deprecated).

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles](https://docs.astro.build/en/guides/styling/)
- [Markdown processors and plugins](https://docs.astro.build/en/guides/markdown-content/)
