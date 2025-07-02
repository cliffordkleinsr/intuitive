import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { consumerDeats, consumerPackage, SurveyTable, UsersTable } from '$lib/server/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [clients] = await db
		.select({
			id: UsersTable.id,
			name: UsersTable.fullname,
			email: consumerDeats.email,
			phone: consumerDeats.phone,
			company: consumerDeats.company_name,
			inactive: consumerDeats.disabled,
			packagetype: consumerPackage.package_type,
			surveys: count(SurveyTable.surveyid)
		})
		.from(UsersTable)
		.leftJoin(consumerDeats, eq(consumerDeats.consumerid, params.clientid))
		.rightJoin(
			SurveyTable,
			sql`${SurveyTable.consumer_id} = ${params.clientid}
        `
		)
		.rightJoin(consumerPackage, eq(consumerPackage.consumerid, params.clientid))
		.where(eq(UsersTable.id, params.clientid))
		.groupBy(
			UsersTable.id,
			consumerDeats.email,
			consumerDeats.phone,
			consumerDeats.disabled,
			consumerDeats.company_name,
			consumerPackage.package_type
		);

	// console.log(clients)
	return { clients };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const active = data.get('active') === 'true';
		try {
			await db.transaction(async (tx) => {
				await tx
					.update(UsersTable)
					.set({
						disabled: active
					})
					.where(eq(UsersTable.id, params.clientid));
				await tx
					.update(consumerDeats)
					.set({
						disabled: active
					})
					.where(eq(consumerDeats.consumerid, params.clientid));
			});
		} catch (error) {
			console.error(error);
		}
		redirect(302, `/dashboard/users/clients/${params.clientid}`);
	}
};
