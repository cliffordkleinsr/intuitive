import { db } from '$lib/server/db';
import { SurveyTable, UsersTable } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const survey_list = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			by: UsersTable.fullname,
			created: sql<Date>`${SurveyTable.created_at}::timestamp::date`
		})
		.from(SurveyTable)
		.where(eq(SurveyTable.status, 'Live'))
		.leftJoin(UsersTable, eq(UsersTable.id, SurveyTable.consumer_id))
		.orderBy(desc(SurveyTable.created_at));
	return {
		survey_list
	};
};
