import { agentSurveysTable, old_SurveyTable } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals: { user } }) => {
	const uid = user?.id as string;
	const select = {
		id: old_SurveyTable.surveyid,
		title: old_SurveyTable.surveyTitle,
		created: sql<Date>`${old_SurveyTable.createdAt}::timestamp::date`
	};

	
	const poll = await db
		.select(select)
		.from(old_SurveyTable)
		.where(
			sql`
                ${old_SurveyTable.clientid} = ${uid} 
                `
		);
	return {
		poll
	};
}) satisfies PageServerLoad;
