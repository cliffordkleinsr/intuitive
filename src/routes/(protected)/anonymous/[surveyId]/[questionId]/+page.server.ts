import {
	enumBuilder,
	multipleSchema,
	openEndedSchema,
	rankBuilder,
	ratingSchema
} from '$lib/custom/blocks/reader/super_schema';
import {
	fetchOptionIdfromOption,
	getBranches,
	getIpCookie,
	getNextQuestion,
	getsurveyQuestionByID,
	getsurveyQuestions,
	handleSurveyProgressExt,
	orderQuestions,
	questionCount,
	validateAnswerNotExists
} from '$lib/server/db/db_utils';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { QuestionOptions, response_table, surveyqnsTableV2 } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load = (async ({ params: { surveyId, questionId }, cookies }) => {
	const [surveyqns, branches, ids] = await Promise.all([
		// params
		getsurveyQuestionByID(questionId),
		getBranches(surveyId),
		questionCount(surveyId)
	]);
	// Order questions
	// const { ordered, questionIndexMap, branchMap } = orderQuestions(surveyqns, branches);
	// console.log(branches)
	let pool_size = ids.length;
	// console.log(ids)
	let pool_questions = surveyqns[0];
	// for the optionalschema
	const optionalSchema = enumBuilder(pool_questions.options);
	const rankSchema = rankBuilder(pool_questions.options);
	const [openEndedForm, optionalForm, rankForm, multiForm, rateForm] = await Promise.all([
		// schemas
		superValidate(zod4(openEndedSchema)),
		superValidate(zod4(optionalSchema)),
		superValidate(zod4(rankSchema)),
		superValidate(zod4(multipleSchema)),
		superValidate(zod4(ratingSchema))
	]);
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');

	const cache = { current_ix, pool_size, pool_questions };
	const this_branch = branches.find(
		(b) => b.questionId === questionId || b.nextQuestionId === questionId
	);
	const qns = await getsurveyQuestions(surveyId);
	const branch_for = qns.find((q) => q.id === this_branch?.questionId && q.id !== questionId);

	// Determine the next question (pass null if no option has been selected)
	// const nextQuestion = getNextQuestion(questionId, null, ordered, questionIndexMap, branchMap);
	return {
		openEndedForm,
		optionalForm,
		rankForm,
		multiForm,
		rateForm,
		cache,
		cur_id: questionId,
		branch_for
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	singleform: async ({ request, params: { surveyId, questionId }, cookies, getClientAddress }) => {
		const openEndedForm = await superValidate(request, zod4(openEndedSchema));
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
			await db.insert(response_table).values({
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
		const ip = getClientAddress(); //getIpCookie(cookies);
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies, address: ip });
	},
	radioGroup: async ({ request, params: { surveyId, questionId }, cookies, getClientAddress }) => {
		// build the schema
		const surveyqns = await getsurveyQuestionByID(questionId);
		const optionalSchema = enumBuilder(surveyqns[0]?.options);

		const optionalForm = await superValidate(request, zod4(optionalSchema));
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
			await db.insert(response_table).values({
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
		const opts = await fetchOptionIdfromOption(questionId, type);
		const ip = getClientAddress(); //getIpCookie(cookies);
		if (opts)
			return await handleSurveyProgressExt({
				surveyId,
				cookies,
				selectedOptionId: opts.optionid as string,
				address: ip
			});

		return await handleSurveyProgressExt({
			surveyId,
			cookies,
			selectedOptionId: undefined,
			address: ip
		});
	},
	rankform: async ({ request, params: { surveyId, questionId }, cookies, getClientAddress }) => {
		// build the schema
		const surveyqns = await getsurveyQuestionByID(questionId);
		const rankSchema = rankBuilder(surveyqns[0]?.options);

		const rankForm = await superValidate(request, zod4(rankSchema));
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
				await db.insert(response_table).values({
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
		const ip = getClientAddress();
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies, address: ip });
	},
	checkboxMultiple: async ({
		request,
		params: { surveyId, questionId },
		cookies,
		getClientAddress
	}) => {
		const multiForm = await superValidate(request, zod4(multipleSchema));
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
				await db.insert(response_table).values({
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
		const ip = getClientAddress(); //getIpCookie(cookies);
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies, address: ip });
	},
	rateform: async ({ request, params: { surveyId, questionId }, cookies, getClientAddress }) => {
		const rateForm = await superValidate(request, zod4(ratingSchema));
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
			await db.insert(response_table).values({
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
		const ip = getClientAddress(); //getIpCookie(cookies);
		// Dynamic routing with incremental counter
		return await handleSurveyProgressExt({ surveyId, cookies, address: ip });
	}
};
