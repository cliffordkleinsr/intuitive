import { db } from '$lib/server/db';
import { sql, count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { agentSurveysTable, AnswersTable, UsersTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const usr = user?.id as string;

	const [[cumulative_analytics], gender_analytics] = await Promise.all([
		db
			.select({
				total_responses: count()
			})
			.from(agentSurveysTable)
			.where(
				sql`
                ${agentSurveysTable.survey_completed} = true
                and
                ${agentSurveysTable.surveyid} = 'wncpwl3rf3h2zes'
            `
			),

		db
			.select({
				gender: sql<string>`UPPER(${UsersTable.gender})`,
				count: count(UsersTable.id)
			})
			.from(UsersTable)
			.leftJoin(agentSurveysTable, sql`${UsersTable.id} = ${agentSurveysTable.agentid}`)
			.where(
				sql`
                ${agentSurveysTable.surveyid} = 'wncpwl3rf3h2zes'
                and
                ${agentSurveysTable.survey_completed} = TRUE
            `
			)
			.groupBy(UsersTable.gender)
	]);

	// console.log(gender_analytics)
	return {
		cumulative_analytics
	};
};
