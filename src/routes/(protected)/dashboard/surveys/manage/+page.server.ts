import { db } from '$lib/server/db';
import {
	QuestionBranching,
	QuestionOptions,
	surveyqnsTableV2,
	SurveyTable,
	UsersTable
} from '$lib/server/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const surveys = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			by: UsersTable.fullname,
			expires: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`,
			status: SurveyTable.status
		})
		.from(SurveyTable)
		.leftJoin(UsersTable, eq(UsersTable.id, SurveyTable.consumer_id))
		.orderBy(desc(SurveyTable.created_at));
	return {
		surv: surveys
	};
};

export const actions: Actions = {
	deleteSurvey: async ({ request }) => {
		type En = {
			id: string;
		};
		const data = Object.fromEntries(await request.formData()) as En;
		const { id } = data;
		// console.log(data)
		try {
			const ids = await db
				.select({
					el: QuestionOptions.optionId
				})
				.from(surveyqnsTableV2)
				.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
				.where(eq(surveyqnsTableV2.surveid, id));
			await db.transaction(async (tx) => {
				await tx.delete(QuestionBranching).where(eq(QuestionBranching.surveid, id));
				for (const { el } of ids) {
					if (el) {
						// console.log(id)
						await tx.delete(QuestionOptions).where(eq(QuestionOptions.optionId, el));
					}
				}
				await tx.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, id));
				await tx.delete(SurveyTable).where(eq(SurveyTable.surveyid, id));
			});
		} catch (err) {
			console.error(err);
		}
	}
};
