import { db } from '$lib/server/db';
import { count, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { agentData, UsersTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({}) => {
	const totalAgentsQuery = db.select({ total: sql<number>`COUNT(*)` }).from(agentData);

	const [
		[age_groups],
		level_education,
		county_analytics,
		gender_analytics,
		income_analytics,
		sector_analytics
	] = await Promise.all([
		db
			.select({
				age_distribution: sql<Array<{ label: string; value: number }>>`
            json_build_array(
                json_build_object(
                    'label', '18-24',
                    'value', COUNT(CASE WHEN ${UsersTable.age} >= 18 AND ${UsersTable.age} <= 24 THEN 1 END)::integer
                ),
                json_build_object(
                    'label', '25-34',
                    'value', COUNT(CASE WHEN ${UsersTable.age} >= 25 AND ${UsersTable.age} <= 34 THEN 1 END)::integer
                ),
                json_build_object(
                    'label', '35-44',
                    'value', COUNT(CASE WHEN ${UsersTable.age} >= 35 AND ${UsersTable.age} <= 44 THEN 1 END)::integer
                ),
                json_build_object(
                    'label', '45-54',
                    'value', COUNT(CASE WHEN ${UsersTable.age} >= 45 AND ${UsersTable.age} <= 54 THEN 1 END)::integer
                ),
                json_build_object(
                    'label', '55+',
                    'value', COUNT(CASE WHEN ${UsersTable.age} >= 55 THEN 1 END)::integer
                )
            )`
			})
			.from(UsersTable)
			.where(
				sql`
                    ${UsersTable.role} = 'AGENT'
                `
			),

		db
			.select({
				education: agentData.education,
				percentage: sql<number>`
                    ROUND((COUNT(*)::float / (${totalAgentsQuery})) * 100)
                `
			})
			.from(agentData)
			.groupBy(agentData.education),

		db
			.select({
				county: sql<string>`${agentData.county}`,
				value: count(agentData.agentid)
			})
			.from(agentData)
			.groupBy(agentData.county),

		db
			.select({
				gender: UsersTable.gender,
				count: count()
			})
			.from(UsersTable)
			.where(
				sql`
                ${UsersTable.role} = 'AGENT'
            `
			)
			.groupBy(UsersTable.gender),

		db
			.select({
				income: agentData.income,
				count: count()
			})
			.from(agentData)
			.groupBy(agentData.income),

		db
			.select({
				sector: agentData.sector,
				count: count()
			})
			.from(agentData)
			.groupBy(agentData.sector)
	]);

	// console.log(income_analytics)
	return {
		age_groups,
		level_education,
		county_analytics,
		gender_analytics,
		income_analytics,
		sector_analytics
	};
};
