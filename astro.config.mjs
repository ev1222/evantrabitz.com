// @ts-check

import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const serif = (weight, style) => ({
	src: [`@fontsource/source-serif-4/files/source-serif-4-latin-${weight}-${style}.woff2`],
	weight,
	style,
	display: 'swap',
});

// https://astro.build/config
export default defineConfig({
	site: 'https://evantrabitz.com',
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 defaults to Sätteri; unified() keeps the remark/rehype plugin ecosystem.
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: true,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Source Serif 4',
			cssVariable: '--font-serif',
			fallbacks: ['Georgia', 'serif'],
			options: {
				variants: [
					serif(400, 'normal'),
					serif(400, 'italic'),
					serif(600, 'normal'),
					serif(600, 'italic'),
				],
			},
		},
	],
});
