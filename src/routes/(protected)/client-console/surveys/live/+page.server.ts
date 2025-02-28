import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { SurveyTable } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
export const load: PageServerLoad = async ({ locals }) => {
	const surveys = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			created: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`,
			status: SurveyTable.status
		})
		.from(SurveyTable)
		.where(
			sql`${SurveyTable.status} = 'Draft' and ${SurveyTable.consumer_id} = ${locals.session?.userId}`
		);

	return {
		draft_surveys: surveys
	};
};
