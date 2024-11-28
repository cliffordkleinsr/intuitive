import { db } from '$lib/server/db';
import {
	agentSurveysTable,
	progressTable,
	surveyqnsTableV2,
	SurveyTable
} from '$lib/server/db/schema';
import { asc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getpersistentIx } from '$lib/server/db/db_utils';
import type { SurveyData } from '$lib/types';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, cookies, locals: { user } }) => {
	const [survey] = await db
		.select({
			completed: agentSurveysTable.survey_completed
		})
		.from(agentSurveysTable)
		.where(
			sql`
				${agentSurveysTable.agentid} = ${user?.id}
				and 
				${agentSurveysTable.surveyid} = ${params.surveyId}
				`
		);
	const queryResult = await db
		.select()
		.from(SurveyTable)
		.where(
			sql`
			${SurveyTable.surveyid} = ${params.surveyId}
			and
			${SurveyTable.status} = 'Live'
		`
		);

	if (survey.completed === true) {
		redirect(303, '/agent-console', { type: 'info', message: 'Survey Is Not Available' }, cookies);
	}
	if (queryResult.length === 0) {
		redirect(303, '/agent-console', { type: 'info', message: 'Survey Has been Closed' }, cookies);
	}
	async function getSurvey() {
		let uri: string = '';
		const [ids, ixi, surveyqns] = await Promise.all([
			db
				.select({
					id: surveyqnsTableV2.questionId
				})
				.from(surveyqnsTableV2)
				.where(eq(surveyqnsTableV2.surveid, params.surveyId))
				.orderBy(asc(surveyqnsTableV2.updatedAt)),

			getpersistentIx(user?.id!, params.surveyId),

			db.select().from(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, params.surveyId))
		]);

		let current_ix = parseInt(cookies.get('current_ix') ?? '0');
		// first check whether we have a cookie for the indexed session
		if (current_ix === 0) {
			// if not we check whether we have a persisted index in the database
			// if there is a persisted index in the database return the uri with the index url
			current_ix = ixi;
		}
		uri = `/agent-console/surveys/take/${params.surveyId}/${ids[current_ix].id}`;

		const data = {
			available_surv: {
				uri,
				current_ix,
				question_cnt: surveyqns.length,
				survId: params.surveyId
			}
		};
		return data as SurveyData;
	}

	return await getSurvey();
};
