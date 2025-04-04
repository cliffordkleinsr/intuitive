import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { surveyqnsTableV2, SurveyTable, user_analytics } from '$lib/server/db/schema';
import { asc, eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { setIpCookie } from '$lib/server/db/db_utils';

export const load = (async ({ params: { surveyId }, cookies, url, fetch, getClientAddress }) => {
	const surveid = surveyId as string;
	const ip = getClientAddress(); //await setIpCookie(cookies);

	const [ids, surveyqns, [user_data]] = await Promise.all([
		db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, surveid))
			.orderBy(asc(surveyqnsTableV2.updatedAt)),

		db.select().from(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, surveid)),
		db
			.select()
			.from(user_analytics)
			.where(and(eq(user_analytics.surveyid, surveid), eq(user_analytics.client_address, ip)))
	]);
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');
	let uri = `/anonymous/${surveid}/${ids[current_ix].id}`;
	// console.log(getClientAddress())
	let has_completed = Boolean(cookies.get('has_completed') ?? false);
	if (user_data && has_completed && !url.pathname.includes('complete')) {
		const has_completed = user_data.has_completed;
		if (has_completed) {
			redirect(
				303,
				`/anonymous/${surveid}/complete`,
				{ type: 'info', message: 'You have already completed this survey' },
				cookies
			);
		}
	}
	const [details] = await db
		.select({
			title: SurveyTable.title
		})
		.from(SurveyTable)
		.where(eq(SurveyTable.surveyid, surveid));
	return {
		uri,
		current_ix,
		question_cnt: surveyqns.length,
		survId: surveid,
		title: details.title
	};
}) satisfies LayoutServerLoad;
