import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { db } from '$lib/server/db';
import { and, asc, avg, count, countDistinct, desc, eq, not, sql } from 'drizzle-orm';
import {
	agentSurveysTable,
	AnswersTable,
	consumerDeats,
	response_table,
	SurveyTable,
	user_analytics
} from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals: { user }, url, cookies }) => {
	if (!user) {
		redirect(
			302,
			handleLoginRedirect('/', url),
			{ type: 'info', message: 'Log in to view page' },
			cookies
		);
	}
	if (user.role !== 'ADMIN') {
		redirect(303, '/', { type: 'error', message: 'Not Allowed' }, cookies);
	}

	const [survey_time, live] = await Promise.all([
		db
			.select({
				time: sql<Date>`${SurveyTable.created_at}::timestamp::date`,
				count: count()
			})
			.from(SurveyTable)
			.groupBy(SurveyTable.created_at)
			.limit(7),

		// db
		// 	.select({
		// 		title: SurveyTable.title,
		// 		responses: count(AnswersTable.answer),
		// 		total: countDistinct(AnswersTable.agentId)
		// 	})
		// 	.from(SurveyTable)
		// 	.leftJoin(AnswersTable, sql`${AnswersTable.surveid} = ${SurveyTable.surveyid}`)
		// 	.groupBy(SurveyTable.title, SurveyTable.created_at)
		// 	.orderBy(desc(SurveyTable.created_at)),

		db
			.select()
			.from(SurveyTable)
			.where(sql`${SurveyTable.status} = 'Live'`)
	]);

	const [{ total_clients }] = await db
		.select({
			total_clients: count()
		})
		.from(consumerDeats);

	const survs = await db
		.select({
			title: SurveyTable.title,
			responses: count(response_table.answer),
			total: countDistinct(user_analytics.id)
		})
		.from(SurveyTable)
		.where(
			and(
				not(eq(SurveyTable.surveyid, '7adba2c0-f1f2-40bd-b1b0-2ffefa755348')), //aliquant,
				not(eq(SurveyTable.surveyid, 'c082054d-46e4-4bdf-ac24-810d17406e7c')) //Amber peak
			)
		)
		.leftJoin(response_table, eq(response_table.surveid, SurveyTable.surveyid))
		.leftJoin(user_analytics, eq(user_analytics.surveyid, SurveyTable.surveyid))
		.groupBy(SurveyTable.title, SurveyTable.created_at)
		.orderBy(desc(SurveyTable.created_at));
	return {
		user,
		survey_time,
		surveys: survs,
		count: live.length,
		total_clients
	};
};
