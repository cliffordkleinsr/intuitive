import { db } from '$lib/server/db';
import { QuestionOptions, surveyqnsTableV2 } from '$lib/server/db/schema';
import { sql, eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import type { clientData } from '$lib/types';
import { getsurveyQuestions } from '$lib/server/db/db_utils';
import { enumBuilder } from '$lib/custom/blocks/reader/super_schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ params: { surveyid, questionid } }) => {
	const questions = await db
		.select({
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			likert_key: sql<string>`${surveyqnsTableV2.likertKey}`,
			optionid: sql<string[]>`ARRAY_AGG(${QuestionOptions.optionId}) AS optionid`,
			options: sql<string[]>`ARRAY_AGG(${QuestionOptions.option}) AS options`,
			created_at: surveyqnsTableV2.createdAt
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.surveid, surveyid))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.createdAt));

	const [available_qns] = await getsurveyQuestions(questionid);
	const optionalSchema = enumBuilder(available_qns.options);
	const optionalForm = await superValidate(zod(optionalSchema));
	const pre = {
		available_qns,
		questions
	};
	const data = pre as clientData;

	return { ...data, optionalForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {}
};
