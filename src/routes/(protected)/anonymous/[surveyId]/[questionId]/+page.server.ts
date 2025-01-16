import {
	enumBuilder,
	multipleSchema,
	openEndedSchema,
	rankBuilder,
	ratingSchema
} from '$lib/custom/blocks/client/reader/super_schema';
import {
	getsurveyQuestions,
	handleSurveyProgressExt,
	questionCount,
	validateAnswerNotExists
} from '$lib/server/db/db_utils';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { ext_answersTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load = (async ({ params, cookies }) => {
	const [surveyqns, ids] = await Promise.all([
		// params
		getsurveyQuestions(params.questionId),
		questionCount(params.surveyId)
	]);

	let pool_size = ids.length;
	let pool_questions = surveyqns[0];
	// for the optionalschema
	const optionalSchema = enumBuilder(pool_questions.options);
	const rankSchema = rankBuilder(pool_questions.options);
	const [openEndedForm, optionalForm, rankForm, multiForm, rateForm] = await Promise.all([
		// schemas
		superValidate(zod(openEndedSchema)),
		superValidate(zod(optionalSchema)),
		superValidate(zod(rankSchema)),
		superValidate(zod(multipleSchema)),
		superValidate(zod(ratingSchema))
	]);
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');

	const cache = { current_ix, pool_size, pool_questions };
	return {
		openEndedForm,
		optionalForm,
		rankForm,
		multiForm,
		rateForm,
		cache,
		cur_id: params.questionId
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	singleform: async ({ request, params: { surveyId, questionId }, cookies }) => {
		const openEndedForm = await superValidate(request, zod(openEndedSchema));
		// validate
		if (!openEndedForm.valid) {
			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		//  destructure
		const { answer } = openEndedForm.data;

		try {
			await db.insert(ext_answersTable).values({
				questionId: questionId,
				surveid: surveyId,
				answer: answer
			});
		} catch (err) {
			console.error(err);

			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		const next = await handleSurveyProgressExt({ surveyId, cookies });
	},
	radioGroup: async ({ request, params: { surveyId, questionId }, cookies }) => {
		// build the schema
		const surveyqns = await getsurveyQuestions(questionId);
		const optionalSchema = enumBuilder(surveyqns[0]?.options);

		const optionalForm = await superValidate(request, zod(optionalSchema));
		// validate
		if (!optionalForm.valid) {
			return message(optionalForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		//  destructure
		const { type } = optionalForm.data;

		try {
			await db.insert(ext_answersTable).values({
				questionId: questionId,
				surveid: surveyId,
				answer: type
			});
		} catch (err) {
			console.error(err);

			return message(optionalForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies });
	},
	rankform: async ({ request, params: { surveyId, questionId }, cookies }) => {
		// build the schema
		const surveyqns = await getsurveyQuestions(questionId);
		const rankSchema = rankBuilder(surveyqns[0]?.options);

		const rankForm = await superValidate(request, zod(rankSchema));
		// validate
		if (!rankForm.valid) {
			return message(rankForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		const hasNullValue = Object.values(rankForm.data).some((value) => value === 'null');

		if (hasNullValue) {
			return message(rankForm, {
				alertType: 'error',
				alertText: 'Please Ensure that you select all options'
			});
		}

		try {
			for (const [answer, rankId] of Object.entries(rankForm.data)) {
				await db.insert(ext_answersTable).values({
					questionId: questionId,
					surveid: surveyId,
					rankId: rankId,
					answer: answer
				});
			}
		} catch (err) {
			console.error(err);

			return message(rankForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies });
	},
	checkboxMultiple: async ({ request, params: { surveyId, questionId }, cookies }) => {
		const multiForm = await superValidate(request, zod(multipleSchema));
		// validate
		if (!multiForm.valid) {
			return message(multiForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		//  destructure
		const { items } = multiForm.data;
		try {
			for (const { id, label } of items) {
				await db.insert(ext_answersTable).values({
					questionId: questionId,
					surveid: surveyId,
					optionId: id,
					answer: label
				});
			}
		} catch (err) {
			console.error(err);

			return message(multiForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies });
	},
	rateform: async ({ request, params: { surveyId, questionId }, cookies }) => {
		const rateForm = await superValidate(request, zod(ratingSchema));
		// validate
		if (!rateForm.valid) {
			return message(rateForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		//  destructure
		const { answer } = rateForm.data;

		try {
			await db.insert(ext_answersTable).values({
				questionId: questionId,
				surveid: surveyId,
				answer: answer.toString()
			});
		} catch (err) {
			console.error(err);

			return message(rateForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies });
	}
};
