import { db } from '$lib/server/db';
import { sql, count, eq, countDistinct } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {
	agentData,
	agentSurveysTable,
	AnswersTable,
	surveyqnsTableV2,
	UsersTable
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const usr = user?.id as string;
	const answerCounts = db
		.select({
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			answer: AnswersTable.answer,
			answer_count: count(AnswersTable.answer).as('answer_count'),
			percentage: sql<number>`
				ROUND(
					COUNT(*)::decimal / 
					SUM(COUNT(*)) OVER (PARTITION BY ${surveyqnsTableV2.question}) * 100,
					1
				)
			`.as('percentage')
		})
		.from(surveyqnsTableV2)
		.rightJoin(AnswersTable, sql`${AnswersTable.questionId} = ${surveyqnsTableV2.questionId}`)
		.where(
			sql`
				${AnswersTable.surveid} = 'wncpwl3rf3h2zes'
			`
		)
		.groupBy(
			surveyqnsTableV2.questionId,
			surveyqnsTableV2.question,
			surveyqnsTableV2.questionT,
			AnswersTable.answer
		)
		.as('answer_counts');
	const [[cumulative_analytics], gender_analytics, sector_analytics, analytics] = await Promise.all(
		[
			db
				.select({
					total_responses: count()
				})
				.from(agentSurveysTable)
				.where(
					sql`
                ${agentSurveysTable.survey_completed} = true
                and
                ${agentSurveysTable.surveyid} = 'wncpwl3rf3h2zes'
            `
				),

			db
				.select({
					gender: sql<string>`UPPER(${UsersTable.gender})`,
					count: count(UsersTable.id)
				})
				.from(UsersTable)
				.leftJoin(agentSurveysTable, sql`${UsersTable.id} = ${agentSurveysTable.agentid}`)
				.where(
					sql`
                ${agentSurveysTable.surveyid} = 'wncpwl3rf3h2zes'
                and
                ${agentSurveysTable.survey_completed} = TRUE
            `
				)
				.groupBy(UsersTable.gender),
			db
				.select({
					sector: sql<string>`SPLIT_PART(${agentData.sector}, '-', 2)`,
					count: count(agentData.agentid)
				})
				.from(agentData)
				.leftJoin(agentSurveysTable, sql`${agentData.agentid} = ${agentSurveysTable.agentid}`)
				.where(
					sql`${agentSurveysTable.surveyid} = 'wncpwl3rf3h2zes' and ${agentSurveysTable.survey_completed} = TRUE`
				)
				.groupBy(agentData.sector),

			db
				.select({
					question: sql<string>`${answerCounts.question}`,
					question_type: sql<string>`${answerCounts.question_type}`,
					answer_statistics: sql<{ answer: string; count: number; percentage: number }[]>`
				json_agg(
				  jsonb_build_object(
					'answer', ${answerCounts.answer},
					'count', ${answerCounts.answer_count},
					'percentage', ${answerCounts.percentage}
				  )
				)`
				})
				.from(answerCounts)
				.groupBy(answerCounts.question, answerCounts.question_type)
		]
	);

	return {
		cumulative_analytics,
		gender_analytics,
		sector_analytics,
		analytics
	};
};
