# evantrabitz.com

Source for [evantrabitz.com](https://evantrabitz.com). Built with Astro and deployed as a static-assets Cloudflare Worker (`wrangler.jsonc`) by Workers Builds from the `production` branch, which a GitHub Action moves to each pushed version tag (`v*.*.*`).

```sh
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # static site → dist/
```

- Posts: `src/content/writing/*.md(x)`
- Resume: `public/resume.pdf`, committed automatically from a private LaTeX repo
- Site settings (contact, Giscus, analytics): `src/consts.ts`

See `AGENTS.md` for design decisions and the publishing workflow.
