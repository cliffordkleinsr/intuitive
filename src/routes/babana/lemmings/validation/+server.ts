import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const data = await request.json();
	return new Response(JSON.stringify(data));
};
