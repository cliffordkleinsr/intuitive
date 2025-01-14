import { industries } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return new Response(JSON.stringify(industries), { status: 200 });
};
