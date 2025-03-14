import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const url = 'https://api.ipify.org?format=json';

	const res = await fetch(url);

	const response = await res.json();
	return new Response(JSON.stringify(response), {
		headers: {
			'Content-type': 'application/json'
		},
		status: res.status
	});
};
