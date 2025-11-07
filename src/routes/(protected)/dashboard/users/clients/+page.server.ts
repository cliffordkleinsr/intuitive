import { db } from '$lib/server/db';
import { UsersTable } from '$lib/server/db/schema';
import { desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const client_list = await db
		.select({
			id: UsersTable.id,
			name: UsersTable.fullname,
			email: UsersTable.email,
			createdat: sql<Date>`TO_CHAR((${UsersTable.createdAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}), 'DD/MM/YYYY HH24:MI:SS')`
		})
		.from(UsersTable)
		.where(sql`${UsersTable.role} = 'CLIENT'`)
		.orderBy(desc(UsersTable.createdAt));

	return {
		client_list
	};
};
