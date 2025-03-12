import type { GeocodeAPI } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { latitude, longitude } = (await request.json()) as GeocodeAPI;
	const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
	const res = await fetch(url, {
		method: 'GET'
	});

	return new Response(JSON.stringify(await res.json()), { status: res.status });
};
