import { db } from '$lib/server/db';
import {
	AnswersTable,
	consumerPackage,
	pricingTable,
	surveyqnsTableV2,
	SurveyTable,
	user_analytics
} from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { retSurveyInfo } from '$lib/server/db/db_utils';
import { addDays } from '$lib/custom/functions/helpers';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;
	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await retSurveyInfo(userid);
	const total_agents = await db
		.select()
		.from(user_analytics)
		.leftJoin(SurveyTable, eq(SurveyTable.surveyid, user_analytics.surveyid))
		.where(eq(SurveyTable.consumer_id, userid));

	return {
		count: total_agents.length,
		all_surv: allsurveys,
		draft_surv: draftsurveys,
		live_surv: livesurveys,
		closed_surv: closedsurveys
	};
};

export const actions: Actions = {
	addTemplate: async ({ request, locals }) => {
		const userid = locals.user?.id as string;
		const form = await request.formData();

		const title = form.get('title') as string;
		const questions = form.getAll('single_question') as string[];

		const max_responses = 800;

		const today = Date.now();

		const date_val = 30; //returnDateValue(type as string, plan);
		const expiry_date = addDays(today, date_val);
		const uuid = crypto.randomUUID();

		const pre = questions.map((q) => ({
			surveid: uuid,
			question: q
		}));
		try {
			await db.transaction(async (tx) => {
				await tx.insert(SurveyTable).values({
					surveyid: uuid,
					consumer_id: userid,
					title: title,
					max_responses: max_responses,
					survey_expires: expiry_date
				});

				await tx.insert(surveyqnsTableV2).values(pre);
			});
		} catch (err) {
			console.error(err);
		}

		redirect(303, `/client-console/surveys/edit/${uuid}`);
	}
};
