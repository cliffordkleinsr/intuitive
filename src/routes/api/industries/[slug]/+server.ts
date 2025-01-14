import { industries } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const industry = industries.find((item) => item.industryName === params.slug);
	// console.log(industry)
	return new Response(JSON.stringify(industry), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
