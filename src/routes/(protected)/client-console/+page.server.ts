import { db } from '$lib/server/db';
import {
	AnswersTable,
	consumerPackage,
	costTable,
	pricingTable,
	QuestionOptions,
	response_table,
	surveyqnsTableV2,
	SurveyTable,
	user_analytics,
	userPackage
} from '$lib/server/db/schema';
import { eq, sql, and, count, countDistinct } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { retSurveyInfo } from '$lib/server/db/db_utils';
// import { addDays } from '$lib/custom/functions/helpers';
import { addSeconds, addDays } from 'date-fns';
import { redirect } from 'sveltekit-flash-message/server';
import { addYears } from 'date-fns/addYears';
export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;
	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await retSurveyInfo(userid);
	const total_agents = await db
		.select()
		.from(user_analytics)
		.leftJoin(SurveyTable, eq(SurveyTable.surveyid, user_analytics.surveyid))
		.where(eq(SurveyTable.consumer_id, userid));

	const [tot_agents] = await db
		.select({
			cnt: countDistinct(response_table.questionId)
		})
		.from(response_table)
		.leftJoin(SurveyTable, eq(SurveyTable.surveyid, response_table.surveid))
		.where(eq(SurveyTable.consumer_id, userid));
	return {
		count: tot_agents,
		all_surv: allsurveys,
		draft_surv: draftsurveys,
		live_surv: livesurveys,
		closed_surv: closedsurveys
	};
};

export const actions: Actions = {
	addTemplate: async ({ request, locals, cookies }) => {
		const userid = locals.user?.id as string;
		const formData = await request.formData();
		const title = formData.get('title') as string;

		const entries = formData.entries();

		let questions: {
			question: string;
			option: string[];
			type: 'Single' | 'Optional' | 'Rating';
		}[] = [];

		const freeTier = {
			plan: 'Free',
			max_responses: 800
		};
		const feature = await db
			.select({
				max_responses: costTable.max_responses,
				plan: costTable.title
			})
			.from(userPackage)
			.leftJoin(costTable, eq(userPackage.package_id, costTable.id))
			.where(eq(userPackage.consumerid, userid))
			.limit(1);
		const features = feature[0] ?? freeTier;
		// const max_responses = 800;
		const now = new Date();
		const today = Date.now();
		const date_val = features.plan === 'Free' ? 0.5 : 1;
		const expiry_date = addYears(today, date_val);
		const uuid = crypto.randomUUID();
		for (const [key, value] of entries) {
			if (key.startsWith('optional_question_')) {
				const idx = key.split('_').pop(); // e.g. "0", "2"
				const qns = value.toString();

				const opts = formData.getAll(`radio_option_${idx}`).map(String);
				questions.push({
					question: qns,
					option: opts,
					type: 'Optional'
				});
			}
			if (key === 'rating_question') {
				questions.push({
					question: value.toString(),
					option: [],
					type: 'Rating'
				});
			}
			if (key === 'single_question') {
				questions.push({
					question: value.toString(),
					option: [],
					type: 'Single'
				});
			}
		}
		try {
			await db.transaction(async (tx) => {
				await tx.insert(SurveyTable).values({
					surveyid: uuid,
					consumer_id: userid,
					title: title,
					max_responses: features.max_responses as number,
					survey_expires: expiry_date
				});
				for (const [i, q] of questions.entries()) {
					const quid = crypto.randomUUID();
					const At = addSeconds(now, i * 2);

					await tx.insert(surveyqnsTableV2).values({
						questionId: quid,
						surveid: uuid,
						questionT: q.type,
						question: q.question,
						createdAt: At,
						updatedAt: At
					});

					if (q.option.length) {
						const opts = q.option.map((option, i) => ({
							questionId: quid,
							option,
							order_index: i
						}));
						await tx.insert(QuestionOptions).values(opts);
					}
				}
			});
		} catch (err) {
			console.error(err);
		}
		redirect(
			303,
			`/client-console/surveys/edit/${uuid}`,
			{ type: 'success', message: 'Added Successfully' },
			cookies
		);
	}
};

// const single_insertion = single_questions.map((q, i) => ({
// 	surveid: uuid,
// 	question: q,
// 	created_at: new Date(now.getTime() + i * 1000), // +1s per question
// 	updated_at: new Date(now.getTime() + i * 1000)
// }));
// const rating_insertion = rating_questions.map((q, i) => ({
// 	surveid: uuid,
// 	questionT: 'Rating',
// 	question: q,
// 	created_at: new Date(now.getTime() + i * 1000), // +2s per next iter question
// 	updated_at: new Date(now.getTime() + i * 1000)
// }));

// const title = form.get('title') as string;
// const questions = form.getAll('single_question') as string[];

// const max_responses = 800;

// const today = Date.now();

// const date_val = 30; //returnDateValue(type as string, plan);
// const expiry_date = addDays(today, date_val);
// const uuid = crypto.randomUUID();
// const now = new Date();
// const pre = questions.map((q, i) => ({
// 	surveid: uuid,
// 	question: q,
// 	created_at: new Date(now.getTime() + i * 1000), // +1s per question
// 	updated_at: new Date(now.getTime() + i * 1000)
// }));
// try {
// 	await db.transaction(async (tx) => {
// 		await tx.insert(SurveyTable).values({
// 			surveyid: uuid,
// 			consumer_id: userid,
// 			title: title,
// 			max_responses: max_responses,
// 			survey_expires: expiry_date
// 		});

// 		await tx.insert(surveyqnsTableV2).values(pre);
// 	});
// } catch (err) {
// 	console.error(err);
// }

// redirect(303, `/client-console/surveys/edit/${uuid}`);
