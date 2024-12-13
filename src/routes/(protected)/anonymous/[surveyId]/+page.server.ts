import { db } from '$lib/server/db';
import { surveyqnsTableV2 } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { asc, eq, sql } from 'drizzle-orm';

export const load = (async ({ params, cookies }) => {
	const [ids, surveyqns] = await Promise.all([
		db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyId))
			.orderBy(asc(surveyqnsTableV2.updatedAt)),

		db.select().from(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, params.surveyId))
	]);
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');
	let uri = `/anonymous/${params.surveyId}/${ids[current_ix].id}`;
	return {
		uri,
		current_ix,
		question_cnt: surveyqns.length,
		survId: params.surveyId
	};
}) satisfies PageServerLoad;
