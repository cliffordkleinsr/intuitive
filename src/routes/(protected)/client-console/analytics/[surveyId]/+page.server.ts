import { db } from '$lib/server/db';
import { sql, count, asc, desc, countDistinct } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {
	agentData,
	agentSurveysTable,
	AnswersTable,
	surveyqnsTableV2,
	UsersTable
} from '$lib/server/db/schema';
import { unionAll } from 'drizzle-orm/pg-core';

export const load: PageServerLoad = async ({ locals: { user }, params: { surveyId } }) => {
	const usr = user?.id as string;

	// subqueries
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
				and
				${surveyqnsTableV2.questionT} != 'Ranking'
				`
		)
		.groupBy(
			surveyqnsTableV2.questionId,
			surveyqnsTableV2.question,
			surveyqnsTableV2.questionT,
			AnswersTable.answer
		)
		.orderBy(desc(count(AnswersTable.answer)))
		.as('answer_counts');

	// CTE to calculate total distinct agents per question
	const totalAgentsCTE = db
		.select({
			questionId: surveyqnsTableV2.questionId,
			totalAgents: countDistinct(AnswersTable.agentId).as('totalAgents')
		})
		.from(surveyqnsTableV2)
		.rightJoin(AnswersTable, sql`${AnswersTable.questionId} = ${surveyqnsTableV2.questionId}`)
		.where(
			sql`
			${surveyqnsTableV2.surveid} = ${surveyId}
			and
			${surveyqnsTableV2.questionT} = 'Ranking'
		`
		)
		.groupBy(surveyqnsTableV2.questionId)
		.as('totalAgentsCTE');

	// Main query using the CTE
	const rank_stats = db
		.select({
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			answer: AnswersTable.answer,
			updated: sql<Date>`${surveyqnsTableV2.updatedAt}`.as('updated_at'),
			rank: AnswersTable.rankId,
			count: count(AnswersTable.agentId).as('count'),
			percentage: sql<number>`
				ROUND(
					COUNT(DISTINCT ${AnswersTable.agentId})::decimal /
					${totalAgentsCTE.totalAgents} * 100,
					1
				)
			`.as('percentage')
		})
		.from(surveyqnsTableV2)
		.rightJoin(AnswersTable, sql`${AnswersTable.questionId} = ${surveyqnsTableV2.questionId}`)
		.leftJoin(totalAgentsCTE, sql`${totalAgentsCTE.questionId} = ${surveyqnsTableV2.questionId}`)
		.where(
			sql`
				${surveyqnsTableV2.surveid} = ${surveyId}
				and
				${surveyqnsTableV2.questionT} = 'Ranking'
			`
		)
		.groupBy(
			AnswersTable.answer,
			AnswersTable.rankId,
			surveyqnsTableV2.updatedAt,
			surveyqnsTableV2.question,
			surveyqnsTableV2.questionT,
			totalAgentsCTE.totalAgents
		)
		.as('rank_stats');
	// end
	// builders
	const rest = db
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
			)`,
			updated: answerCounts.updated
		})
		.from(answerCounts)
		.groupBy(answerCounts.question, answerCounts.question_type, answerCounts.updated)
		.orderBy(asc(answerCounts.updated));
	const rank_analytics = db
		.select({
			question: sql<string>`${rank_stats.question}`,
			question_type: sql<string>`${rank_stats.question_type}`,
			answer_statistics: sql<{ answer: string; rank: string; count: number; percentage: number }[]>`
				json_agg(
					json_build_object(
						'answer', ${rank_stats.answer},
						'rank', ${rank_stats.rank},
						'count', ${rank_stats.count},
						'percentage', ${rank_stats.percentage}
					)
				)`,
			updated: rank_stats.updated
		})
		.from(rank_stats)
		.groupBy(rank_stats.question, rank_stats.question_type, rank_stats.updated)
		.orderBy(asc(rank_stats.updated));
	const [[cumulative_analytics], gender_analytics, sector_analytics, county_analytics] =
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

			//.orderBy(asc(answerCounts.updated)),
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
	const analytics = await unionAll(rest, rank_analytics).orderBy(
		asc(answerCounts.updated),
		asc(rank_stats.updated)
	);

	return {
		cumulative_analytics,
		gender_analytics,
		sector_analytics,
		county_analytics,
		analytics
	};
};
