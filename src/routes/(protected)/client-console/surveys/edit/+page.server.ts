import { db } from '$lib/server/db';
import { QuestionOptions, surveyqnsTableV2, SurveyTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const surveys = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			created: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`
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
		const data = Object.fromEntries(await request.formData()) as En;
		const { id } = data;
		// console.log(data)
		try {
			await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, id));
			await db.delete(SurveyTable).where(eq(SurveyTable.surveyid, id));
		} catch (err) {
			console.error(err);
		}
	}
};
