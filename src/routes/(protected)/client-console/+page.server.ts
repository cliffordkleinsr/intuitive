import { db } from '$lib/server/db';
import { AnswersTable, surveyqnsTableV2, SurveyTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userid = locals.user?.id as string;
	const select = {
		id: SurveyTable.surveyid,
		title: SurveyTable.surveyTitle,
		created: sql<Date>`${SurveyTable.createdAt}::timestamp::date`,
		status: SurveyTable.status
	};

	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await Promise.all([
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${userid}`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${userid} and ${SurveyTable.status} = 'Draft'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${userid} and ${SurveyTable.status} = 'Live'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${userid} and ${SurveyTable.status} = 'Closed'`)
	]);

	const sharable_survey = await db
		.select({
			sharable: SurveyTable.external
		})
		.from(SurveyTable).where(sql`
			${SurveyTable.clientid} = ${userid}
			and
			${SurveyTable.status} = 'Live'
		`);
	// console.log(userid)
	const total_agents = await db
		.selectDistinctOn([AnswersTable.agentId], {
			agent: AnswersTable.agentId
		})
		.from(AnswersTable)
		.leftJoin(SurveyTable, eq(AnswersTable.surveid, SurveyTable.surveyid))
		.where(sql`${SurveyTable.clientid} = ${locals.session?.userId}`);

	return {
		count: total_agents.length,
		all_surv: allsurveys,
		draft_surv: draftsurveys,
		live_surv: livesurveys,
		closed_surv: closedsurveys,
		extern: sharable_survey.length > 0 ? sharable_survey[0].sharable : 0
	};
};
