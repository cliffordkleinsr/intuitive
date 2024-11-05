import { db } from '$lib/server/db';
import { agentSurveysTable, AnswersTable, SurveyTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const finished = await db
		.selectDistinctOn([SurveyTable.surveyid], {
			id: sql<string>`${SurveyTable.surveyid}`,
			title: sql<string>`${SurveyTable.surveyTitle}`,
			taken: sql<string>`${AnswersTable.updatedAt}::timestamp::date`,
			at: sql<string>`TO_CHAR((${AnswersTable.updatedAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::time, 'HH24:MI:SS')`
		})
		.from(SurveyTable)
		.leftJoin(AnswersTable, eq(SurveyTable.surveyid, AnswersTable.surveid))
		.rightJoin(agentSurveysTable, eq(SurveyTable.surveyid, agentSurveysTable.surveyid))
		.where(
			sql`
                ${AnswersTable.agentId} = ${user?.id}
                and
                ${agentSurveysTable.survey_completed} = true
            `
		);
	return {
		history: finished
	};
};
