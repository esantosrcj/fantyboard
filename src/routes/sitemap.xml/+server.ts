import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
	// Define your site's base URL - update this to your actual domain
	const baseUrl = 'https://fantyboard.app/';

	// Static pages in your app
	const staticPages = [
		'', // Homepage
		'settings' // Settings page
	];

	// Build XML sitemap content
	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>${baseUrl}/${page}</loc>
		<changefreq>weekly</changefreq>
		<priority>${page === '' ? '1.0' : '0.8'}</priority>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600' // Cache for 1 hour
		}
	});
};
