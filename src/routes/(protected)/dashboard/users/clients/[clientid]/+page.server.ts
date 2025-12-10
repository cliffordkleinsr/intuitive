import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { consumerDeats, consumerPackage, SurveyTable, UsersTable } from '$lib/server/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// const [clients] = await db
	// 	.select({
	// 		id: UsersTable.id,
	// 		name: UsersTable.fullname,
	// 		email: consumerDeats.email,
	// 		phone: consumerDeats.phone,
	// 		company: consumerDeats.company_name,
	// 		inactive: consumerDeats.disabled,
	// 		packagetype: consumerPackage.package_type,
	// 		surveys: count(SurveyTable.surveyid)
	// 	})
	// 	.from(UsersTable)
	// 	.leftJoin(consumerDeats, eq(consumerDeats.consumerid, params.clientid))
	// 	.rightJoin(
	// 		SurveyTable,
	// 		sql`${SurveyTable.consumer_id} = ${params.clientid}
	//     `
	// 	)
	// 	.rightJoin(consumerPackage, eq(consumerPackage.consumerid, params.clientid))
	// 	.where(eq(UsersTable.id, params.clientid))
	// 	.groupBy(
	// 		UsersTable.id,
	// 		consumerDeats.email,
	// 		consumerDeats.phone,
	// 		consumerDeats.disabled,
	// 		consumerDeats.company_name,
	// 		consumerPackage.package_type
	// 	);
	const [information] = await db
		.select({
			id: UsersTable.id,
			name: UsersTable.fullname,
			email: UsersTable.email,
			company: consumerDeats.company_name,
			phone: consumerDeats.phone,
			inactive: UsersTable.disabled,
			packagetype: sql<string>`COALESCE(${consumerPackage.package_type}, 'Free')`,
			surveys: count(SurveyTable.surveyid)
		})
		.from(UsersTable)
		.leftJoin(consumerDeats, eq(consumerDeats.consumerid, UsersTable.id))
		.leftJoin(consumerPackage, eq(consumerPackage.consumerid, UsersTable.id))
		.leftJoin(SurveyTable, eq(SurveyTable.consumer_id, UsersTable.id))
		.where(eq(UsersTable.id, params.clientid))
		.groupBy(
			UsersTable.id,
			UsersTable.fullname,
			UsersTable.email,
			consumerDeats.phone,
			consumerDeats.company_name,
			UsersTable.disabled,
			consumerPackage.package_type
		);
	// const [details] = await db
	// 	.select({
	// 		id: consumerDeats.consumerid,
	// 		name: UsersTable.fullname,
	// 		email: consumerDeats.email,
	// 		phone: consumerDeats.phone,
	// 		company: consumerDeats.company_name,
	// 		inactive: consumerDeats.disabled,
	// 		packagetype: sql<string>`COALESCE(${consumerPackage.package_type}, 'Free')`,
	// 		surveys: count(SurveyTable.surveyid)
	// 	})
	// 	.from(consumerDeats)
	// 	.leftJoin(SurveyTable, eq(SurveyTable.consumer_id, consumerDeats.consumerid))
	// 	.leftJoin(UsersTable, eq(UsersTable.id, consumerDeats.consumerid))
	// 	.leftJoin(consumerPackage, eq(consumerPackage.consumerid, consumerDeats.consumerid))
	// 	.where(eq(UsersTable.id, params.clientid))
	// 	.groupBy(
	// 		consumerDeats.consumerid,
	// 		UsersTable.fullname,
	// 		consumerDeats.email,
	// 		consumerDeats.phone,
	// 		consumerDeats.company_name,
	// 		consumerDeats.disabled,
	// 		consumerPackage.package_type
	// 	);

	return { details: information };
}) satisfies PageServerLoad;

export const actions: Actions = {
	disableUser: async ({ request, params }) => {
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
		// redirect(302, `/dashboard/users/clients/${params.clientid}`);
	},
	deleteUser: async ({ params }) => {
		try {
			await db.delete(UsersTable).where(eq(UsersTable.id, params.clientid));
		} catch (error) {
			console.error(error);
		}
		redirect(302, '/dashboard/users/clients');
	}
};
