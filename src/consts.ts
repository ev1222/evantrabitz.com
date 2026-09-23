// Site-wide settings. Anything left as an empty string is simply not rendered.

export const SITE_TITLE = 'Evan Trabitz';
export const SITE_DESCRIPTION = 'Essays and short posts by Evan Trabitz.';
export const AUTHOR = 'Evan Trabitz';

export const CONTACT = {
	email: '', // TODO: public contact address
	location: '', // TODO: e.g. "New York, NY"
	github: 'https://github.com/ev1222',
	linkedin: '', // TODO: e.g. https://www.linkedin.com/in/<handle>/
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
