import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { db } from '$lib/server/db';
import { avg, count, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { agentSurveysTable, AnswersTable, SurveyTable } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals: { user }, url }) => {
	if (!user) {
		redirect(302, handleLoginRedirect('/', url));
	}

	const [survey_time, surveys, live] = await Promise.all([
		db
			.select({
				time: sql<Date>`${SurveyTable.created_at}::timestamp::date`,
				count: count()
			})
			.from(SurveyTable)
			.groupBy(SurveyTable.created_at)
			.limit(7),

		db
			.select({
				title: SurveyTable.title,
				responses: count(AnswersTable.answer),
				total: countDistinct(AnswersTable.agentId)
			})
			.from(SurveyTable)
			.leftJoin(AnswersTable, sql`${AnswersTable.surveid} = ${SurveyTable.surveyid}`)
			.groupBy(SurveyTable.title),

		db
			.select()
			.from(SurveyTable)
			.where(sql`${SurveyTable.status} = 'Live'`)
	]);

	return {
		user,
		survey_time,
		surveys,
		count: live.length
	};
};
