// Site-wide settings. Anything left as an empty string is simply not rendered.

export const SITE_TITLE = 'Evan Trabitz';
export const SITE_DESCRIPTION = 'Evan Trabitz is an AI Engineer far from the frontier, close to the problems, writing about AI and philosophy. Essays, notes, and resume.';
export const AUTHOR = 'Evan Trabitz';

export const CONTACT = {
	email: 'hello@evantrabitz.com',
	location: 'Columbus, OH',
	github: 'https://github.com/ev1222',
	linkedin: 'https://www.linkedin.com/in/etrabitz/',
};

// Giscus (https://giscus.app). Fill these in after the GitHub repo exists and
// Discussions is enabled; comments stay hidden until all four are set.
export const GISCUS = {
	repo: '', // "ev1222/evantrabitz.com"
	repoId: '',
	category: 'Comments',
	categoryId: '',
};

// Cloudflare Web Analytics beacon token. Leave empty if automatic setup is enabled
// for the zone in the Cloudflare dashboard instead (it injects the beacon itself).
export const CF_ANALYTICS_TOKEN = '';
