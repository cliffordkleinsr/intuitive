import { agentSurveysTable, SurveyTable } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals: { user } }) => {
	const uid = user?.id as string;
	const select = {
		id: SurveyTable.surveyid,
		title: SurveyTable.title,
		created: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`
	};

	const poll = await db
		.select(select)
		.from(SurveyTable)
		.where(
			sql`
                ${SurveyTable.consumer_id} = ${uid} 
                and 
                ${SurveyTable.status} != 'Draft'
                `
		);
	return {
		poll
	};
}) satisfies PageServerLoad;
