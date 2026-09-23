import { getCollection } from 'astro:content';

/** All publishable posts, newest first. Drafts are included only in dev. */
export async function getPosts() {
	const posts = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (id: string) => `/writing/${id}/`;
