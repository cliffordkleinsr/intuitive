import { db } from '$lib/server/db';
import { payoutRequests, UsersTable } from '$lib/server/db/schema';
import { sql, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const payouts = await db
		.select({
			id: payoutRequests.payoutid,
			name: sql<string>`${UsersTable.fullname}`,
			payout: payoutRequests.payout,
			status: payoutRequests.status,
			processedat: sql<Date>`${payoutRequests.processedAt}::timestamp`
		})
		.from(payoutRequests)
		.leftJoin(UsersTable, sql`${payoutRequests.agentid} = ${UsersTable.id}`)
		.orderBy(asc(payoutRequests.status));

	return {
		payouts
	};
};
