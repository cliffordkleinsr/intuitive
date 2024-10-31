import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

const site = dev ? 'http://localhost:5173' : 'https://int-insights.com'; // change this to reflect your domain
const industries: string[] = ['hospitality', 'healthcare', 'retail_fmcg', 'financial_services'];
const services: string[] = [
	'corp_rep',
	'brand_image',
	'customer_experience',
	'product_assessment',
	'market_reaserch'
];
const pages: string[] = ['about', 'pricing'];
export const GET: RequestHandler = async () => {
	const body = sitemap(pages, services, industries);
	const response = new Response(body);
	response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
	response.headers.set('Content-Type', 'application/xml');
	return response;
};

const sitemap = (
	routes: string[],
	serviceName: string[],
	industryName: string[]
) => `<?xml version="1.0" encoding="UTF-8" ?>


<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
    <!-- <url> elements go here -->
    <url>
        <loc>${site}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    ${routes
			.map(
				(route) =>
					`
    <url>
        <loc>${site}/${route}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    `
			)
			.join('')}
    ${industryName
			.map(
				(element) =>
					`
    <url>
        <loc>${site}/industries/${element}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    `
			)
			.join('')}
    ${serviceName
			.map(
				(element) =>
					`
    <url>
        <loc>${site}/services/${element}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    `
			)
			.join('')}
</urlset>`;
