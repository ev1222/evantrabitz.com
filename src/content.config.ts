import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
	loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// "essay" = long-form; "short" = everything else. Controls the homepage section.
		kind: z.enum(['essay', 'short']).default('short'),
		// Drafts render in `astro dev` but are excluded from production builds, RSS and the sitemap.
		draft: z.boolean().default(false),
		// Set after cross-posting (POSSE) to render an "Also on Substack" link.
		substackUrl: z.url().optional(),
		comments: z.boolean().default(true),
	}),
});

export const collections = { writing };
