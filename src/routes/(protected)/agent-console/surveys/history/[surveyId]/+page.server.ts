import { db } from '$lib/server/db';
import { AnswersTable, surveyqnsTableV2 } from '$lib/server/db/schema';
import { eq, sql, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const questions = await db
		.selectDistinctOn([surveyqnsTableV2.questionId, surveyqnsTableV2.updatedAt], {
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			surv_id: surveyqnsTableV2.surveid,
			question_type: surveyqnsTableV2.questionT,
			answer: sql<string[]>`ARRAY_AGG(${AnswersTable.answer}) AS answers`,
			rankIds: sql<string[]>`ARRAY_AGG(${AnswersTable.rankId}) AS rankIds`
		})
		.from(surveyqnsTableV2)
		.leftJoin(AnswersTable, eq(surveyqnsTableV2.questionId, AnswersTable.questionId))
		.where(
			sql`${surveyqnsTableV2.surveid} = ${params.surveyId} and ${AnswersTable.agentId} = ${locals.session?.userId}`
		)
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question, surveyqnsTableV2.surveid)
		.orderBy(asc(surveyqnsTableV2.updatedAt));

	return {
		questions
	};
};
