import { db } from '$lib/server/db';
import {
	QuestionBranching,
	QuestionOptions,
	surveyqnsTableV2,
	SurveyTable
} from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const surveys = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			expires: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`
		})
		.from(SurveyTable)
		.where(
			sql`${locals.user?.id} = ${SurveyTable.consumer_id} and ${SurveyTable.status} = 'Draft'`
		);

	return {
		surv: surveys
	};
};

export const actions: Actions = {
	deleteSurvey: async ({ request }) => {
		type En = {
			id: string;
		};
		// const data = Object.fromEntries(await request.formData()) as En;
		// const { id } = data;
		const data = await request.formData();
		const id = data.get('id') as string;
		// console.log(data)
		try {
			// const ids = await db
			// 	.select({
			// 		el: QuestionOptions.optionId
			// 	})
			// 	.from(surveyqnsTableV2)
			// 	.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
			// 	.where(eq(surveyqnsTableV2.surveid, id));
			// await db.transaction(async (tx) => {
			// 	await tx.delete(QuestionBranching).where(eq(QuestionBranching.surveid, id));
			// 	for (const { el } of ids) {
			// 		if (el) {
			// 			// console.log(id)
			// 			await tx.delete(QuestionOptions).where(eq(QuestionOptions.optionId, el));
			// 		}
			// 	}
			// 	await tx.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, id));
			// 	await tx.delete(SurveyTable).where(eq(SurveyTable.surveyid, id));
			// });
			await db.delete(SurveyTable).where(eq(SurveyTable.surveyid, id));
		} catch (err) {
			console.error(err);
		}
	}
};
