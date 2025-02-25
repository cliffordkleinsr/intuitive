import { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ fetch }) => {
	const url = 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken';

	const payload = {
		consumer_key: PESAPAL_CONSUMER_KEY,
		consumer_secret: PESAPAL_CONSUMER_SECRET
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json'
		},
		body: JSON.stringify(payload)
	});

	return new Response(JSON.stringify(await response.json()), { status: response.status });
};
