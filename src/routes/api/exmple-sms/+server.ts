import { sendSms } from '$lib/server/smss/send';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.json();
	const data = await sendSms(payload);

	return new Response(data);
};
