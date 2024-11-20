import { db } from '$lib/server/db';
import { sql, count, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {
	agentData,
	agentSurveysTable,
	AnswersTable,
	surveyqnsTableV2,
	UsersTable
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals: { user }, params: { surveyId } }) => {
	const usr = user?.id as string;
	const answerCounts = db
		.select({
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			answer: AnswersTable.answer,
			updated: sql<Date>`${surveyqnsTableV2.updatedAt}`.as('updated_at'),
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
				${AnswersTable.surveid} = ${surveyId}
				`
		)
		.groupBy(
			surveyqnsTableV2.questionId,
			surveyqnsTableV2.question,
			surveyqnsTableV2.questionT,
			AnswersTable.answer
		)
		.orderBy(asc(count(AnswersTable.answer)))
		.as('answer_counts');
	const [[cumulative_analytics], gender_analytics, sector_analytics, analytics, county_analytics] =
		await Promise.all([
			db
				.select({
					total_responses: count()
				})
				.from(agentSurveysTable)
				.where(
					sql`
						${agentSurveysTable.survey_completed} = true
						and
						${agentSurveysTable.surveyid} = ${surveyId}
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
                ${agentSurveysTable.surveyid} = ${surveyId}
                and
                ${agentSurveysTable.survey_completed} = TRUE
            `
				)
				.groupBy(UsersTable.gender),
			db
				.select({
					sector: sql<string>`${agentData.sector}`,
					count: count(agentData.agentid)
				})
				.from(agentData)
				.leftJoin(agentSurveysTable, sql`${agentData.agentid} = ${agentSurveysTable.agentid}`)
				.where(
					sql`${agentSurveysTable.surveyid} = ${surveyId}
					and 
					${agentSurveysTable.survey_completed} = TRUE`
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
				.groupBy(answerCounts.question, answerCounts.question_type, answerCounts.updated)
				.orderBy(asc(answerCounts.updated)),
			db
				.select({
					county: sql<string>`${agentData.county}`,
					value: count(agentData.agentid)
				})
				.from(agentData)
				.leftJoin(agentSurveysTable, sql`${agentData.agentid} = ${agentSurveysTable.agentid}`)
				.where(
					sql`
						${agentSurveysTable.surveyid} = ${surveyId} 
						and 
						${agentSurveysTable.survey_completed} = TRUE
						`
				)
				.groupBy(agentData.county)
		]);

	return {
		cumulative_analytics,
		gender_analytics,
		sector_analytics,
		county_analytics,
		analytics
	};
};
