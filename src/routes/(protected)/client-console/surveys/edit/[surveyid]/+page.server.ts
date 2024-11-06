import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, asc, sql } from 'drizzle-orm';
import { QuestionOptions, SurveyTable, surveyqnsTableV2 } from '$lib/server/db/schema';
export const load: PageServerLoad = async ({ params, locals: { user } }) => {
	const [data] = await db
		.select({
			title: SurveyTable.surveyTitle,
			desc: SurveyTable.surveyDescription
		})
		.from(SurveyTable)
		.where(
			sql`${SurveyTable.surveyid} = ${params.surveyid} and ${SurveyTable.clientid} = ${user?.id}`
		);

	const questions = await db
		.select({
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			likert_key: surveyqnsTableV2.likertKey,
			optionid: sql<string[]>`ARRAY_AGG(${QuestionOptions.optionId}) AS optionid`,
			options: sql<string[]>`ARRAY_AGG(${QuestionOptions.option}) AS options`
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.surveid, params.surveyid))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.updatedAt));

	return {
		surveydata: data,
		surveyqns: questions
	};
};
