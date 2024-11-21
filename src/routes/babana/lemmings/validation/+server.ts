import type { Confirmation } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const data: Confirmation = await request.json();
	return new Response(JSON.stringify(data));
};
