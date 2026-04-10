import {
	enumBuilder,
	multipleSchema,
	openEndedSchema,
	rankBuilder,
	ratingSchema
} from '$lib/custom/blocks/reader/super_schema';
import { getsurveyQuestionByID, getsurveyQuestions } from '$lib/server/db/db_utils';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { response_table } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load = (async ({ params: { surveyId } }) => {
	const questions = await getsurveyQuestions(surveyId);

	const questionsWithForms = await Promise.all(
		questions.map(async (q) => {
			const opts = (q.options ?? []).filter(Boolean) as string[];
			const safeOpts = opts.length > 0 ? opts : ['n/a'];
			const optionalSchema = enumBuilder(safeOpts);
			const rankSchema = rankBuilder(safeOpts);
			const [openEndedForm, optionalForm, rankForm, multiForm, rateForm] = await Promise.all([
				superValidate(zod4(openEndedSchema)),
				superValidate(zod4(optionalSchema)),
				superValidate(zod4(rankSchema)),
				superValidate(zod4(multipleSchema)),
				superValidate(zod4(ratingSchema))
			]);
			return { ...q, openEndedForm, optionalForm, rankForm, multiForm, rateForm };
		})
	);

	return { questionsWithForms };
}) satisfies PageServerLoad;

export const actions: Actions = {
	singleform: async ({ request, url, params: { surveyId } }) => {
		const questionId = url.searchParams.get('questionId')!;
		const openEndedForm = await superValidate(request, zod4(openEndedSchema));
		if (!openEndedForm.valid) {
			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'Please check your entry'
			});
		}
		const { answer } = openEndedForm.data;
		try {
			await db.insert(response_table).values({ questionId, surveid: surveyId, answer });
		} catch (err) {
			console.error(err);
			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'An unexpected error occurred'
			});
		}
		return message(openEndedForm, { alertType: 'success', alertText: 'Answer saved!' });
	},

	radioGroup: async ({ request, url, params: { surveyId } }) => {
		const questionId = url.searchParams.get('questionId')!;
		const surveyqns = await getsurveyQuestionByID(questionId);
		const opts = (surveyqns[0]?.options ?? []).filter(Boolean) as string[];
		const optionalSchema = enumBuilder(opts.length > 0 ? opts : ['n/a']);
		const optionalForm = await superValidate(request, zod4(optionalSchema));
		if (!optionalForm.valid) {
			return message(optionalForm, {
				alertType: 'error',
				alertText: 'Please check your entry'
			});
		}
		const { type } = optionalForm.data;
		try {
			await db.insert(response_table).values({ questionId, surveid: surveyId, answer: type });
		} catch (err) {
			console.error(err);
			return message(optionalForm, {
				alertType: 'error',
				alertText: 'An unexpected error occurred'
			});
		}
		return message(optionalForm, { alertType: 'success', alertText: 'Answer saved!' });
	},

	rankform: async ({ request, url, params: { surveyId } }) => {
		const questionId = url.searchParams.get('questionId')!;
		const surveyqns = await getsurveyQuestionByID(questionId);
		const opts = (surveyqns[0]?.options ?? []).filter(Boolean) as string[];
		const rankSchema = rankBuilder(opts.length > 0 ? opts : ['n/a']);
		const rankForm = await superValidate(request, zod4(rankSchema));
		if (!rankForm.valid) {
			return message(rankForm, {
				alertType: 'error',
				alertText: 'Please check your entry'
			});
		}
		const hasNullValue = Object.values(rankForm.data).some((v) => v === 'null');
		if (hasNullValue) {
			return message(rankForm, {
				alertType: 'error',
				alertText: 'Please select all options'
			});
		}
		try {
			for (const [answer, rankId] of Object.entries(rankForm.data)) {
				await db.insert(response_table).values({
					questionId,
					surveid: surveyId,
					rankId: rankId as string,
					answer
				});
			}
		} catch (err) {
			console.error(err);
			return message(rankForm, {
				alertType: 'error',
				alertText: 'An unexpected error occurred'
			});
		}
		return message(rankForm, { alertType: 'success', alertText: 'Answer saved!' });
	},

	checkboxMultiple: async ({ request, url, params: { surveyId } }) => {
		const questionId = url.searchParams.get('questionId')!;
		const multiForm = await superValidate(request, zod4(multipleSchema));
		if (!multiForm.valid) {
			return message(multiForm, {
				alertType: 'error',
				alertText: 'Please check your entry'
			});
		}
		const { items } = multiForm.data;
		try {
			for (const { id, label } of items) {
				await db.insert(response_table).values({
					questionId,
					surveid: surveyId,
					optionId: id,
					answer: label
				});
			}
		} catch (err) {
			console.error(err);
			return message(multiForm, {
				alertType: 'error',
				alertText: 'An unexpected error occurred'
			});
		}
		return message(multiForm, { alertType: 'success', alertText: 'Answer saved!' });
	},

	rateform: async ({ request, url, params: { surveyId } }) => {
		const questionId = url.searchParams.get('questionId')!;
		const rateForm = await superValidate(request, zod4(ratingSchema));
		if (!rateForm.valid) {
			return message(rateForm, {
				alertType: 'error',
				alertText: 'Please check your entry'
			});
		}
		const { answer } = rateForm.data;
		try {
			await db.insert(response_table).values({
				questionId,
				surveid: surveyId,
				answer: answer.toString()
			});
		} catch (err) {
			console.error(err);
			return message(rateForm, {
				alertType: 'error',
				alertText: 'An unexpected error occurred'
			});
		}
		return message(rateForm, { alertType: 'success', alertText: 'Answer saved!' });
	}
};
