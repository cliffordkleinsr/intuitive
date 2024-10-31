import { services } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const res = services.find((item) => item.serviceName === params.slug);

	return new Response(JSON.stringify(res), { status: 200 });
};
