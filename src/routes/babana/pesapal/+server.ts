import { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } from '$env/static/private';
import { getRegisteredIPNS, regeisteripnURL } from '$lib/server/pesapal';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await getRegisteredIPNS();

	return new Response(JSON.stringify(data));
};
