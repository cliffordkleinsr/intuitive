import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { clientData, clientPackages, SurveyTable } from '$lib/server/db/schema';
import { createNewSurvey, getpackageFeatures } from '$lib/server/db/db_utils';
import { eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const sq = db
		.select({
			id: SurveyTable.surveyid,
			clientid: clientData.clientId,
			createdat: SurveyTable.createdAt,
			packageid: clientData.packageid,
			typeid: clientData.typeid,
			processed: sql<Date>`${clientData.processed_at}::date`.as('processed'),
			expires: sql<Date>`${clientData.expires_at}::date`.as('expires')
		})
		.from(SurveyTable)
		.leftJoin(clientData, eq(SurveyTable.clientid, clientData.clientId))
		.where(
			sql`
				${SurveyTable.clientid} = ${user?.id}
			`
		)
		.as('sq');
	const [survey_metrics] = await db
		.select({
			id: sq.clientid,
			surveys: sql<{ id: string; created: Date }[]>`
			json_agg(
				json_build_object(
					'id', ${sq.id},
					'created', ${sq.createdat}::date
				)
			)
		`,
			packagetype: sql<string>`
		CASE
				WHEN ${sq.typeid} = ${clientPackages.priceIdMn} THEN 'Monthly'
				WHEN ${sq.typeid} = ${clientPackages.priceIdYr} THEN 'Yearly'
				ELSE '0'
			END
		`,
			subscribed_at: sq.processed,
			expires_at: sq.expires
		})
		.from(sq)
		.leftJoin(clientPackages, sql`${clientPackages.packageid} = ${sq.packageid}`)
		.where(
			sql`
			${sq.clientid} = ${user?.id}
		`
		)
		.groupBy(
			sq.clientid,
			sq.typeid,
			sq.processed,
			sq.expires,
			clientPackages.priceIdMn,
			clientPackages.priceIdYr
		);
	return {
		survey_metrics
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		type FormData = {
			surveyTitle: string;
			surveyDescription: string;
		};
		const data = Object.fromEntries(await request.formData()) as FormData;

		const { surveyTitle, surveyDescription } = data;
		const userid: string = locals.user?.id || '';

		const { maxsurv } = await getpackageFeatures(userid);
		const surveys = await db
			.select({
				id: SurveyTable.surveyid
			})
			.from(SurveyTable)
			.leftJoin(clientData, eq(SurveyTable.clientid, clientData.clientId)).where(sql`
                ${SurveyTable.createdAt} BETWEEN ${clientData.processed_at} - INTERVAL '1 week' AND ${clientData.expires_at} 
                AND 
                ${SurveyTable.clientid} = ${userid}
            `);

		// ensure not empty
		if (surveyTitle === '') {
			return fail(404, { message: 'Please fill in the Survey Title!' });
		}

		// Ensure that we cant submit if we have no plans
		if (maxsurv === null) {
			return fail(404, { message: 'You are not subscribed to any plan!' });
		}
		// Ensure we cant submit if weve exeeded our limit
		if (surveys.length === maxsurv) {
			return fail(404, {
				message: 'You have exceeded the maximum available surveys for your plan!'
			});
		}
		try {
			const id = crypto.randomUUID();
			await createNewSurvey({
				surveyid: id,
				clientid: userid,
				surveyTitle: surveyTitle,
				surveyDescription: surveyDescription
			});
		} catch (err) {
			console.error(err);
		}
		redirect(303, '/client-console/surveys/edit');
	}
};
