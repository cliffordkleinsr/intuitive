import { db } from '$lib/server/db';
import { SurveyTable } from '$lib/server/db/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { user } }) => {
	const uid = user?.id as string;
	const live_survey = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			expires: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`
		})
		.from(SurveyTable)
		.where(and(eq(SurveyTable.consumer_id, uid), ne(SurveyTable.status, 'Draft')));
	return {
		live_survey
	};
}) satisfies PageServerLoad;
