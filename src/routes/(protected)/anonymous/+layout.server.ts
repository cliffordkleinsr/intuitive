import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { surveyqnsTableV2 } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';

export const load = (async ({ params: { surveyId }, cookies }) => {
	const surveid = surveyId as string;
	const [ids, surveyqns] = await Promise.all([
		db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, surveid))
			.orderBy(asc(surveyqnsTableV2.updatedAt)),

		db.select().from(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, surveid))
	]);
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');
	let uri = `/anonymous/${surveid}/${ids[current_ix].id}`;
	return {
		uri,
		current_ix,
		question_cnt: surveyqns.length,
		survId: surveid
	};
}) satisfies LayoutServerLoad;
