# evantrabitz.com

Source for [evantrabitz.com](https://evantrabitz.com). Built with Astro and deployed as a static-assets Cloudflare Worker (`wrangler.jsonc`) by Workers Builds on every push to `main`.

```sh
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # static site → dist/
```

- Posts: `src/content/writing/*.md(x)`
- CV: `public/cv.pdf`, committed automatically from a private LaTeX repo
- Site settings (contact, Giscus, analytics): `src/consts.ts`

See `AGENTS.md` for design decisions and the publishing workflow.
