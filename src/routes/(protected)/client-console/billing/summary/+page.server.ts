import type { Actions, PageServerLoad } from './$types';
import { CURRENCY_EXCHANGE_API } from '$env/static/private';
import { db } from '$lib/server/db';
import { clientData } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;
	const res = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_EXCHANGE_API}/latest/USD`);

	const data = await res.json();
	const exchangerate = data.conversion_rates.KES;
	const [details] = await db
		.select({
			phone: clientData.phone
		})
		.from(clientData)
		.where(eq(clientData.clientId, userid));
	return {
		exchangerate,
		phoneno: details.phone
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
	}
};
