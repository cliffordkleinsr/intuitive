import { db } from '$lib/server/db';
import { clientData } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    const [onetime] = await db
		.select({
			state: clientData.onetime
		})
		.from(clientData)
		.where(eq(clientData.clientId, locals.user?.id as string));

	return {
		otp: onetime.state
	};
}) satisfies PageServerLoad;