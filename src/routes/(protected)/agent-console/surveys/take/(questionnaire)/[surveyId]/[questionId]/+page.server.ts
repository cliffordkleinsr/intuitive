import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { openEndedSchema } from '$lib/custom/blocks/reader';
import {
	getpersistentIx,
	getsurveyQuestions,
	handleSurveyProgress,
	indexParser,
	insertprogressData,
	questionCount,
	selectProgressData,
	updateprogressData
} from '$lib/server/db/db_utils';
import { db } from '$lib/server/db';
import { AnswersTable } from '$lib/server/db/schema';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import { enumBuilder, rankBuilder } from '$lib/custom/blocks/reader/super_schema';
import { RedoIcon } from 'lucide-svelte';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
export const load: PageServerLoad = async ({ params, cookies, locals: { user }, url }) => {
	let current_user = user?.id as string;
	if (!current_user) {
		redirect(302, handleLoginRedirect('/agent/signin', url));
	}
	// streams
	const [surveyqns, ids, persisted_ix, sequence] = await Promise.all([
		// params
		getsurveyQuestions(params.questionId),
		questionCount(params.surveyId),
		getpersistentIx(current_user, params.surveyId),
		selectProgressData(current_user, params.surveyId)
	]);
	let pool_size = ids.length;
	let pool_questions = surveyqns[0];
	// for the optionalschema
	const optionalSchema = enumBuilder(pool_questions.options);
	const rankSchema = rankBuilder(pool_questions.options);
	const [openEndedForm, optionalForm, rankForm] = await Promise.all([
		// schemas
		superValidate(zod(openEndedSchema)),
		superValidate(zod(optionalSchema)),
		superValidate(zod(rankSchema))
	]);

	// console.log(surveyqns)
	let current_ix = parseInt(cookies.get('current_ix') ?? '0') || persisted_ix;
	if (sequence.length === 0)
		await insertprogressData({
			surveyid: params.surveyId,
			agentid: current_user,
			current_ix
		});

	const cache = { current_ix, pool_size, pool_questions };
	return {
		openEndedForm,
		optionalForm,
		rankForm,
		cache,
		cur_id: params.questionId
	};
};

export const actions: Actions = {
	singleform: async ({ request, params: { surveyId, questionId }, locals: { user }, cookies }) => {
		const uid = user?.id as string;
		const openEndedForm = await superValidate(request, zod(openEndedSchema));
		// validate
		if (!openEndedForm.valid) {
			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		// validate answer does not exist before proceeding
		const exists = await db
			.select()
			.from(AnswersTable)
			.where(eq(AnswersTable.questionId, questionId));

		if (exists.length > 0)
			redirect(
				303,
				'/agent-console/surveys/take',
				{ type: 'error', message: 'Not Allowed' },
				cookies
			);
		//  destructure
		const { answer } = openEndedForm.data;

		try {
			await db.insert(AnswersTable).values({
				questionId: questionId,
				surveid: surveyId,
				answer: answer,
				agentId: uid
			});
		} catch (err) {
			console.error(err);

			return message(openEndedForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		const next = await handleSurveyProgress({ uid, surveyId, cookies });
		redirect(
			303,
			`/agent-console/surveys/take/${surveyId}/${next}`,
			{ type: 'success', message: 'Input Successfully Recorded' },
			cookies
		);
	},
	radioGroup: async ({ request, params: { surveyId, questionId }, cookies, locals: { user } }) => {
		const uid = user?.id as string;
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
		// validate answer does not exist before proceeding
		const exists = await db
			.select()
			.from(AnswersTable)
			.where(eq(AnswersTable.questionId, questionId));

		if (exists.length > 0)
			redirect(
				303,
				'/agent-console/surveys/take',
				{ type: 'error', message: 'Not Allowed' },
				cookies
			);
		//  destructure
		const { type } = optionalForm.data;

		try {
			await db.insert(AnswersTable).values({
				questionId: questionId,
				surveid: surveyId,
				answer: type,
				agentId: uid
			});
		} catch (err) {
			console.error(err);

			return message(optionalForm, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		// Dynamic routing with incremental counter
		const next = await handleSurveyProgress({ uid, surveyId, cookies });
		redirect(
			303,
			`/agent-console/surveys/take/${surveyId}/${next}`,
			{ type: 'success', message: 'Input Successfully Recorded' },
			cookies
		);
	},
	rankform: async ({ request, params: { surveyId, questionId }, cookies, locals: { user } }) => {
		const uid = user?.id as string;
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

		console.log(rankForm);
	}
};
