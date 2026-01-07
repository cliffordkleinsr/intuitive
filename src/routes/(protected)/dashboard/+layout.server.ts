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
	surveyqnsTableV2,
	SurveyTable,
	user_analytics
} from '$lib/server/db/schema';
import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

export const load: LayoutServerLoad = async ({ locals: { user }, url, cookies }) => {
	const redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN
	});
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
	// const survs = await db
	// 	.select({
	// 		title: SurveyTable.title,
	// 		questions: countDistinct(surveyqnsTableV2.questionId),
	// 		total: countDistinct(user_analytics.id)
	// 	})
	// 	.from(SurveyTable)
	// 	.where(
	// 		and(
	// 			not(eq(SurveyTable.surveyid, '7adba2c0-f1f2-40bd-b1b0-2ffefa755348')), //aliquant,
	// 			not(eq(SurveyTable.surveyid, 'c082054d-46e4-4bdf-ac24-810d17406e7c')) //Amber peak
	// 		)
	// 	)
	// 	.leftJoin(surveyqnsTableV2, eq(surveyqnsTableV2.surveid, SurveyTable.surveyid))
	// 	.leftJoin(user_analytics, eq(user_analytics.surveyid, SurveyTable.surveyid))
	// 	.groupBy(SurveyTable.title, SurveyTable.created_at)
	// 	.orderBy(desc(SurveyTable.created_at));
	const surv2 = await db
		.select({
			title: SurveyTable.title,
			questions: countDistinct(surveyqnsTableV2.questionId),
			total: countDistinct(response_table.questionId)
		})
		.from(SurveyTable)
		.where(
			and(
				not(eq(SurveyTable.surveyid, '7adba2c0-f1f2-40bd-b1b0-2ffefa755348')), //aliquant,
				not(eq(SurveyTable.surveyid, 'c082054d-46e4-4bdf-ac24-810d17406e7c')) //Amber peak
			)
		)
		.leftJoin(surveyqnsTableV2, eq(surveyqnsTableV2.surveid, SurveyTable.surveyid))
		.leftJoin(response_table, eq(response_table.surveid, SurveyTable.surveyid))
		.groupBy(SurveyTable.title, SurveyTable.created_at)
		.orderBy(desc(SurveyTable.created_at))
		

	// .limit(5);

	// console.log(surv2)
	const clnts = await db
		.select({
			total_clients: count(),
			timestamp: consumerDeats.created_at
		})
		.from(consumerDeats)
		.groupBy(consumerDeats.created_at)
		.orderBy(desc(consumerDeats.created_at));

	const count_signup = await redis.get<number>('signup_api_call_counter');
	const count_signin = await redis.get<number>('signin_api_call_counter');
	const last_called_signup = await redis.get<string>('last_called_signup');
	const last_called_signin = await redis.get<string>('last_called_signin');

	const stats = {
		count_signup,
		last_called_signup,
		count_signin,
		last_called_signin
	};
	const series = clnts.map((r) => ({
		count: Number(r.total_clients),
		date: new Date(r.timestamp)
	}));

	return {
		user,
		survey_time,
		surveys: surv2,
		count: live.length,
		total_clients,
		series,
		stats
	};
};
