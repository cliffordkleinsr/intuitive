import { db } from '$lib/server/db';
import { AnswersTable, surveyqnsTableV2, SurveyTable, user_analytics } from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { retSurveyInfo } from '$lib/server/db/db_utils';

export const load: PageServerLoad = async ({ locals: { user }, parent }) => {
	const userid = user?.id as string;
	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await retSurveyInfo(userid);
	const total_agents = await db
		.select()
		.from(user_analytics)
		.leftJoin(SurveyTable, eq(SurveyTable.surveyid, user_analytics.surveyid))
		.where(eq(SurveyTable.consumer_id, userid));

	return {
		count: total_agents.length,
		all_surv: allsurveys,
		draft_surv: draftsurveys,
		live_surv: livesurveys,
		closed_surv: closedsurveys
	};
};
