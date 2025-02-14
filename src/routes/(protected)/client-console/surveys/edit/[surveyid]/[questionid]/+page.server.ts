import { db } from '$lib/server/db';
import { QuestionOptions, surveyqnsTableV2 } from '$lib/server/db/schema';
import { sql, eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import type { clientData } from '$lib/types';
import { getsurveyQuestions } from '$lib/server/db/db_utils';
import { buildSelectSchema } from '$lib/custom/blocks/reader/super_schema';
import { message, setError, superValidate } from 'sveltekit-superforms';
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
	const selectSchema = buildSelectSchema(available_qns.options.length);
	const selectForm = await superValidate(zod(selectSchema));
	const pre = {
		available_qns,
		questions
	};
	const data = pre as clientData;

	return { ...data, selectForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { questionid } }) => {
		const [available_qns] = await getsurveyQuestions(questionid);
		const selectSchema = buildSelectSchema(available_qns.options.length);
		const selectForm = await superValidate(request, zod(selectSchema));

		// validate
		if (!selectForm.valid) {
			return message(selectForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// check if options
		if (selectForm.data.option0 === '') {
			return setError(selectForm, 'option0', 'Must select an option');
		}
		if (selectForm.data.option1 === '') {
			return setError(selectForm, 'option1', 'Must select an option');
		}
		if (selectForm.data.option0 === selectForm.data.option1) {
			return setError(selectForm, 'option1', 'Each option must be unique');
		}
	}
};
