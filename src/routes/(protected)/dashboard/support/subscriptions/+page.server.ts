import { db } from '$lib/server/db';
import { clientTransactions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const payouts = await db
		.select({
			id: clientTransactions.TransactionCode,
			name: sql<string>`${clientTransactions.FirstName}`,
			amount: clientTransactions.TransAmount,
			processedat: sql<Date>`${clientTransactions.TransTime}::timestamp`
		})
		.from(clientTransactions);

	return {
		payouts
	};
};
