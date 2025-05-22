import { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } from '$env/static/private';
import {
	authToken,
	getRegisteredIPNS,
	regeisteripnURL,
	submitOrderRequest
} from '$lib/server/pesapal';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const data = await submitOrderRequest(
		10,
		'254799725093',
		'https://int-insights.com/babana/ipn',
		'180f2117-758f-4982-a40a-dc1dcb5af8f2',
		'KES'
	);

	return new Response(JSON.stringify(data));
};
