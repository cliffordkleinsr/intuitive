import { services } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(services), { status: 200 });
};
