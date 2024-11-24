import { db } from '$lib/server/db';
import { clientData } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { otp } = await parent();

	return {
		otp
	};
}) satisfies PageServerLoad;
