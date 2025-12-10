import { db } from '$lib/server/db';
import { SurveyTable } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const survey_list = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			status: SurveyTable.status,
			created: SurveyTable.created_at
		})
		.from(SurveyTable);

	return {
		survey_list
	};
};
