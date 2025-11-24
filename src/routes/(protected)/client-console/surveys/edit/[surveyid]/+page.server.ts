import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, asc, sql, and } from 'drizzle-orm';
import {
	QuestionBranching,
	QuestionOptions,
	SurveyTable,
	surveyqnsTableV2
} from '$lib/server/db/schema';
import {
	checkZodSchema,
	editZodSchema,
	likertZodSchema,
	radioZodSchema,
	rankZodSchema,
	rateZodSchema,
	singleZodSchema
} from './editSchems';
import {
	addSurveyQuestionsv2,
	generateFlow,
	getBranches,
	getsurveyQuestions,
	orderQuestions
} from '$lib/server/db/db_utils';
import { ZodError } from 'zod';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { schema } from './(live)/schema';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals: { user }, cookies }) => {
	const [title_desc] = await db
		.select({
			title: SurveyTable.title,
			desc: SurveyTable.description,
			status: SurveyTable.status
		})
		.from(SurveyTable)
		.where(
			and(
				eq(SurveyTable.surveyid, params.surveyid),
				eq(SurveyTable.consumer_id, user?.id as string)
			)
		);
	if (title_desc?.status !== 'Draft')
		redirect(
			303,
			'/client-console',
			{
				type: 'warning',
				message: `Survey ${params.surveyid} has been marked as Live and can no longer be viewed`
			},
			cookies
		);
	const qns = await getsurveyQuestions(params.surveyid);
	const branches = await getBranches(params.surveyid);
	const { ordered: questions } = orderQuestions(qns, branches);
	const flow = generateFlow(qns, branches);
	// console.log(questions)
	// console.log(qns)
	// for the optionalschema
	// const optionalSchema = enumBuilder(pool_questions.options);
	return {
		surveydata: title_desc,
		surveyqns: questions,
		branches,
		flow,
		live_form: await superValidate(zod4(schema))
	};
};

export const actions: Actions = {
	addSingleQns: async ({ request, params }) => {
		type Entry = {
			single_question: string;
		};
		const data = Object.fromEntries(await request.formData()) as Entry;

		try {
			const { single_question } = singleZodSchema.parse(data);
			await addSurveyQuestionsv2({
				surveid: params.surveyid,
				question: single_question
			});
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},

	addMultiQns: async ({ request, params }) => {
		const data = await request.formData();
		const uuid = crypto.randomUUID();
		const construct = {
			question: data.get('question'),
			option: data.getAll('option')
		};

		try {
			// Validate and insert the question once

			const { question, option } = checkZodSchema.parse(construct);

			const options = option.map((item) => ({
				questionId: uuid,
				option: item
			}));
			await db.insert(surveyqnsTableV2).values({
				questionId: uuid,
				surveid: params.surveyid,
				questionT: 'Multiple',
				question: question
			});

			// Insert each unique option for the question
			await db.insert(QuestionOptions).values(options);
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},

	addOptQns: async ({ request, params }) => {
		const data = await request.formData();
		const construct = {
			radio_question: data.get('radio_question'),
			radio_option: data.getAll('radio_option')
		};

		const quid = crypto.randomUUID();

		try {
			// Validate and insert the question once
			const { radio_question, radio_option } = radioZodSchema.parse(construct);

			const options = radio_option.map((item, index) => ({
				questionId: quid,
				option: item,
				order_index: index
			}));
			// console.log(options)
			await db.transaction(async (tx) => {
				await tx.insert(surveyqnsTableV2).values({
					questionId: quid,
					surveid: params.surveyid,
					questionT: 'Optional',
					question: radio_question
				});
				await tx.insert(QuestionOptions).values(options);
			});
			// Insert the option
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	addStarQns: async ({ request, params }) => {
		type Entry = {
			rating_question: string;
		};
		const data = Object.fromEntries(await request.formData()) as Entry;

		try {
			const { rating_question } = rateZodSchema.parse(data);
			await addSurveyQuestionsv2({
				surveid: params.surveyid,
				questionT: 'Rating',
				question: rating_question
			});
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	addLikQns: async ({ request, params }) => {
		type Entry = {
			question: string;
			target: string;
		};
		const data = Object.fromEntries(await request.formData()) as Entry;
		try {
			const { question, target } = likertZodSchema
				.partial({
					target: true
				})
				.parse(data);
			await addSurveyQuestionsv2({
				surveid: params.surveyid,
				questionT: 'Likert',
				question: question,
				likertKey: target
			});
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	addRnkQns: async ({ request, params }) => {
		const data = await request.formData();
		const construct = {
			rnk_question: data.get('rnk_question'),
			rnk_option: data.getAll('rnk_option')
		};
		const quid = crypto.randomUUID();

		try {
			// Validate and insert the question once
			const { rnk_question, rnk_option } = rankZodSchema.parse(construct);

			const options = rnk_option.map((item) => ({
				questionId: quid,
				option: item
			}));
			await db.insert(surveyqnsTableV2).values({
				questionId: quid,
				surveid: params.surveyid,
				questionT: 'Ranking',
				question: rnk_question
			});
			// Insert the option
			await db.insert(QuestionOptions).values(options);
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	deleteSurvQns: async ({ request, params, cookies }) => {
		type EntryId = {
			questionId: string;
			questionType: string;
		};
		const data = Object.fromEntries(await request.formData()) as EntryId;

		const { questionId } = data;

		try {
			await db.delete(QuestionBranching).where(eq(QuestionBranching.nextQuestionId, questionId));
			await db.delete(QuestionBranching).where(eq(QuestionBranching.questionId, questionId));
			await db.delete(QuestionOptions).where(eq(QuestionOptions.questionId, questionId));
			await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.questionId, questionId));
			await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.questionId, questionId));
		} catch (err) {
			console.error(err);
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	editSurvQns: async ({ request, params }) => {
		const data = await request.formData();
		const qns = data.get('question') as string;
		const qid = data.get('questionId') as string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let map: string[] | any[] = [];
		data.forEach((value, name) => {
			if (name === 'option') {
				map = [...map, { option: value } as { option: string }];
			} else if (name === 'optionId') {
				const lastItem = map[map.length - 1];
				lastItem.id = value;
			}
		});
		try {
			await db
				.update(surveyqnsTableV2)
				.set({
					question: qns
				})
				.where(eq(surveyqnsTableV2.questionId, qid));

			for (const insert of map) {
				const { option, id } = editZodSchema.parse(insert);
				await db
					.update(QuestionOptions)
					.set({
						option: option
					})
					.where(eq(QuestionOptions.optionId, id));
			}
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},
	deleteOpt: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const { optionId } = data;

		try {
			await db.delete(QuestionOptions).where(eq(QuestionOptions.optionId, optionId as string));
		} catch (err) {
			console.error(err);
		}
	},

	addTemplate: async ({ request, params }) => {
		const questions = (await request.formData()).getAll('single_question') as string[];
		const pre = questions.map((q) => ({
			surveid: params.surveyid,
			question: q
		}));
		try {
			await db.insert(surveyqnsTableV2).values(pre);
		} catch (err) {
			console.error(err);
		}
		redirect(302, `/client-console/surveys/edit/${params.surveyid}`);
	},

	goLive: async ({ request, params, cookies }) => {
		let live_form = await superValidate(request, zod4(schema));
		// validate
		if (!live_form.valid) {
			return message(live_form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		const [live_survey] = await db
			.update(SurveyTable)
			.set({
				status: 'Live'
			})
			.where(eq(SurveyTable.surveyid, params.surveyid))
			.returning({ expiry: SurveyTable.survey_expires });

		redirect(
			303,
			'/client-console',
			{
				type: 'info',
				message: `Survey ${params.surveyid} has been marked as Live and will expire on ${live_survey.expiry}`
			},
			cookies
		);
	}
};
