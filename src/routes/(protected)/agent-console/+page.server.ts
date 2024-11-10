import type { PageServerLoad } from './$types';
import {
	agentData,
	agentSurveysTable,
	AnswersTable,
	payoutRequests,
	smsVerification,
	SurveyTable
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { user }, url, parent }) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const [dat, [tot_points], complete_surveys, available_qns, payouts] = await Promise.all([
		db
			.select({
				week: sql<Date>`DATE_TRUNC('week', ${AnswersTable.updatedAt})`,
				count: sql<number>`COUNT(*)`
			})
			.from(AnswersTable)
			.leftJoin(agentSurveysTable, sql`${AnswersTable.surveid} = ${agentSurveysTable.surveyid}`)
			.where(
				sql`${AnswersTable.agentId} = ${user?.id} and ${agentSurveysTable.survey_completed} = true`
			)
			.groupBy(sql`DATE_TRUNC('week', ${AnswersTable.updatedAt})`)
			.orderBy(sql`DATE_TRUNC('week', ${AnswersTable.updatedAt})`),

		db
			.select({
				pts: agentData.total_pts_earned,
				pds: agentData.total_pts_paid,
				pybl: agentData.total_points_payable
			})
			.from(agentData)
			.where(eq(agentData.agentid, user?.id as string)),

		db
			.select({
				id: agentSurveysTable.surveyid
			})
			.from(agentSurveysTable)
			.where(
				sql`${agentSurveysTable.survey_completed} = true and ${agentSurveysTable.agentid} = ${user?.id}`
			),
		db
			.select()
			.from(agentSurveysTable)
			.leftJoin(SurveyTable, sql`${agentSurveysTable.surveyid} = ${SurveyTable.surveyid}`)
			.where(
				sql`
                ${agentSurveysTable.agentid} = ${user?.id} 
                and
                ${agentSurveysTable.survey_completed} = false 
                and
                 ${SurveyTable.status} = 'Live'
            `
			),
		db
			.select({
				id: payoutRequests.payoutid,
				payout: payoutRequests.payout,
				status: payoutRequests.status,
				requested: sql`TO_CHAR((${payoutRequests.createdAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}), 'DD/MM/YYYY HH24:MI:SS')`,
				processed: sql`TO_CHAR((${payoutRequests.processedAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}), 'DD/MM/YYYY HH24:MI:SS')`
			})
			.from(payoutRequests)
			.where(sql`${payoutRequests.agentid} = ${user?.id}`)
	]);

	// const dat = await db
	// 	.select({
	// 		week: sql<Date>`DATE_TRUNC('week', ${AnswersTable.updatedAt})`,
	// 		count: sql<number>`COUNT(*)`
	// 	})
	// 	.from(AnswersTable)
	// 	.leftJoin(agentSurveysTable, sql`${AnswersTable.surveid} = ${agentSurveysTable.surveyid}`)
	// 	.where(
	// 		sql`${AnswersTable.agentId} = ${user?.id} and ${agentSurveysTable.survey_completed} = true`
	// 	)
	// 	.groupBy(sql`DATE_TRUNC('week', ${AnswersTable.updatedAt})`)
	// 	.orderBy(sql`DATE_TRUNC('week', ${AnswersTable.updatedAt})`);
	// const [tot_points] = await db
	// 	.select({
	// 		pts: agentData.total_pts_earned,
	// 		pds: agentData.total_pts_paid,
	// 		pybl: agentData.total_points_payable
	// 	})
	// 	.from(agentData)
	// 	.where(eq(agentData.agentid, user?.id as string));
	// const complete_surveys = await db
	// 	.select({
	// 		id: agentSurveysTable.surveyid
	// 	})
	// 	.from(agentSurveysTable)
	// 	.where(
	// 		sql`${agentSurveysTable.survey_completed} = true and ${agentSurveysTable.agentid} = ${user?.id}`
	// 	);
	// const available_qns = await db
	// 	.select()
	// 	.from(agentSurveysTable)
	// 	.leftJoin(SurveyTable, sql`${agentSurveysTable.surveyid} = ${SurveyTable.surveyid}`)
	// 	.where(
	// 		sql`
	//             ${agentSurveysTable.agentid} = ${user?.id}
	//             and
	//             ${agentSurveysTable.survey_completed} = false
	//             and
	//              ${SurveyTable.status} = 'Live'
	//         `
	// 	);
	// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// const payouts = await db
	// 	.select({
	// 		id: payoutRequests.payoutid,
	// 		payout: payoutRequests.payout,
	// 		status: payoutRequests.status,
	// 		requested: sql`TO_CHAR((${payoutRequests.createdAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}), 'DD/MM/YYYY HH24:MI:SS')`,
	// 		processed: sql`TO_CHAR((${payoutRequests.processedAt}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}), 'DD/MM/YYYY HH24:MI:SS')`
	// 	})
	// 	.from(payoutRequests)
	// 	.where(sql`${payoutRequests.agentid} = ${user?.id}`);
	return {
		pending: available_qns.length,
		history: dat,
		total_points: tot_points.pts,
		total_paid: tot_points.pds,
		total_payable: tot_points.pybl,
		complete: complete_surveys.length,
		payouts
	};
};
