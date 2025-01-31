import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, asc, sql } from 'drizzle-orm';
import { QuestionOptions, SurveyTable, surveyqnsTableV2 } from '$lib/server/db/schema';
import {
	checkZodSchema,
	editZodSchema,
	likertZodSchema,
	radioZodSchema,
	rankZodSchema,
	rateZodSchema,
	singleZodSchema
} from './editSchems';
import { addSurveyQuestionsv2 } from '$lib/server/db/db_utils';
import { ZodError } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
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
			likert_key: sql<string>`${surveyqnsTableV2.likertKey}`,
			optionid: sql<string[]>`ARRAY_AGG(${QuestionOptions.optionId}) AS optionid`,
			options: sql<string[]>`ARRAY_AGG(${QuestionOptions.option}) AS options`,
			created_at: surveyqnsTableV2.createdAt
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.surveid, params.surveyid))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.createdAt));
	// console.log(questions)
	return {
		surveydata: data,
		surveyqns: questions
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
		let uuid = crypto.randomUUID();
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

			const options = radio_option.map((item) => ({
				questionId: quid,
				option: item
			}));
			await db.insert(surveyqnsTableV2).values({
				questionId: quid,
				surveid: params.surveyid,
				questionT: 'Optional',
				question: radio_question
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
	deleteSurvQns: async ({ request }) => {
		type EntryId = {
			questionId: string;
			questionType: string;
		};
		const data = Object.fromEntries(await request.formData()) as EntryId;

		const { questionId, questionType } = data;

		try {
			await db.delete(QuestionOptions).where(eq(QuestionOptions.questionId, questionId));
			await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.questionId, questionId));
			await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.questionId, questionId));
		} catch (err) {
			console.error(err);
		}
	},
	editSurvQns: async ({ request }) => {
		const data = await request.formData();
		const qns = data.get('question') as string;
		const qid = data.get('questionId') as string;
		let map: string | any[] = [];
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
	},
	deleteOpt: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const { optionId } = data;

		try {
			await db.delete(QuestionOptions).where(eq(QuestionOptions.optionId, optionId as string));
		} catch (err) {
			console.error(err);
		}
	}
};
