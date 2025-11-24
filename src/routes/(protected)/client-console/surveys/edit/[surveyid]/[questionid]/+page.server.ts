import { db } from '$lib/server/db';
import { QuestionBranching, QuestionOptions, surveyqnsTableV2 } from '$lib/server/db/schema';
import { sql, eq, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import type { clientData } from '$lib/types';
import { getsurveyQuestionByID, getsurveyQuestions } from '$lib/server/db/db_utils';
import { buildSelectSchema } from '$lib/custom/blocks/reader/super_schema';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = (async ({ params: { surveyid, questionid } }) => {
	const questions = await getsurveyQuestions(surveyid);
	const [available_qns] = await getsurveyQuestionByID(questionid);
	const selectSchema = buildSelectSchema(available_qns.options.length);
	const selectForm = await superValidate(zod4(selectSchema));
	const pre = {
		available_qns,
		questions
	};
	const data = pre as clientData;

	return { ...data, selectForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { questionid, surveyid } }) => {
		const [available_qns] = await getsurveyQuestionByID(questionid);
		const selectSchema = buildSelectSchema(available_qns.options.length);
		const selectForm = await superValidate(request, zod4(selectSchema));

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

		const options = available_qns.optionid;
		try {
			for (let i = 0; i < options.length; i++) {
				const nextQuestionId = selectForm.data[`option${i}`];
				const optionId = options[i];
				await db.insert(QuestionBranching).values({
					surveid: surveyid,
					questionId: questionid,
					optionId: optionId,
					nextQuestionId: nextQuestionId
				});
			}
			return message(selectForm, {
				alertType: 'success',
				alertText: 'Branching Saved'
			});
		} catch (error) {
			console.error('Error saving branching logic:', error);
			return message(selectForm, {
				alertType: 'error',
				alertText: 'Failed to save branching logic',
				error
			});
		}
	}
};
