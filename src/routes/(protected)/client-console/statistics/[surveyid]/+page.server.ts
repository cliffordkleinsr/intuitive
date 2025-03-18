import { db } from '$lib/server/db';
import { surveyqnsTableV2, user_analytics } from '$lib/server/db/schema';
import { count, and, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { getAnalytics, simplifiedAnalytics } from '$lib/server/db/db_utils';
import type { FeatureCollection } from 'geojson';
import { fetchGeoJsons } from '$lib/custom/functions/helpers';

export const load = (async ({ fetch, params: { surveyid } }) => {
	const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
	const geojson = (await res.json()) as Topology<{
		countries: GeometryCollection<{ name: string }>;
		land: GeometryCollection;
	}>;

	const popn = await db
		.select({
			id: user_analytics.country,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.country);
	const popn_cnty = await db
		.select({
			id: user_analytics.state,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.state);
	const sec = await db
		.select({
			id: user_analytics.sector,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.sector);

	const edu = await db
		.select({
			id: user_analytics.level_of_education,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.level_of_education);
	// console.debug(popn)
	// const analytics = await getAnalytics(surveyid);

	const analytics = await simplifiedAnalytics(surveyid);
	const total_responses = (
		await db.select().from(user_analytics).where(eq(user_analytics.surveyid, surveyid))
	).length;

	const countries = await fetchGeoJsons();
	// console.log(kenya)
	return {
		geojson,
		countries,
		popn,
		popn_cnty,
		sec,
		edu,
		analytics,
		total_responses
	};
}) satisfies PageServerLoad;
