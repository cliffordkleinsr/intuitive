import { db } from '$lib/server/db';
import { AnswersTable, surveyqnsTableV2, SurveyTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const select = {
		id: SurveyTable.surveyid,
		title: SurveyTable.surveyTitle,
		created: sql<Date>`${SurveyTable.createdAt}::timestamp::date`,
		status: SurveyTable.status
	};

	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await Promise.all([
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${locals.user?.id}`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${locals.user?.id} and ${SurveyTable.status} = 'Draft'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${locals.user?.id} and ${SurveyTable.status} = 'Live'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.clientid} = ${locals.user?.id} and ${SurveyTable.status} = 'Closed'`)
	]);

	const [sharable] = await db
		.select({
			Extern: sql<boolean>`${SurveyTable.external}::boolean`
		})
		.from(SurveyTable)
		.where(sql`${SurveyTable.clientid} = ${locals.user?.id}`);
	// console.log(locals.user?.id)
	const total_agents = await db
		.selectDistinctOn([AnswersTable.agentId], {
			agent: AnswersTable.agentId
		})
		.from(AnswersTable)
		.leftJoin(SurveyTable, eq(AnswersTable.surveid, SurveyTable.surveyid))
		.where(sql`${SurveyTable.clientid} = ${locals.session?.userId}`);

	let sh: boolean = false;
	if (sharable) {
		sh = sharable.Extern;
	}
	return {
		count: total_agents.length,
		all_surv: allsurveys,
		draft_surv: draftsurveys,
		live_surv: livesurveys,
		closed_surv: closedsurveys,
		extern: sh
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
