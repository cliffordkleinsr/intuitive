import { agentSurveysTable, SurveyTable } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals: { user } }) => {
	const uid = user?.id as string;
	const select = {
		id: SurveyTable.surveyid,
		title: SurveyTable.surveyTitle,
		created: sql<Date>`${SurveyTable.createdAt}::timestamp::date`
	};

	const poll = await db
		.select(select)
		.from(SurveyTable)
		.where(
			sql`
                ${SurveyTable.clientid} = ${uid} 
                and 
                ${SurveyTable.status} != 'Draft'
                `
		);
	return {
		poll
	};
}) satisfies PageServerLoad;
