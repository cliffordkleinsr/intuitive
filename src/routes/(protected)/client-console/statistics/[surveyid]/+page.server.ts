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
	let popn_cnty = await db
		.select({
			id: user_analytics.state,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.state);
	let sec = await db
		.select({
			id: user_analytics.sector,
			count: count()
		})
		.from(user_analytics)
		.where(and(eq(user_analytics.surveyid, surveyid)))
		.groupBy(user_analytics.sector);

	let edu = await db
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
	// const anal = analytics.find((f) => f.question === "Rank from the highest to lowest. How do these factors influence your purchase of filters?")
	// console.log(anal?.answer_statistics)
	const total_responses = (
		await db.select().from(user_analytics).where(eq(user_analytics.surveyid, surveyid))
	).length;

	// const countries = ;
	// console.log(popn_cnty)
	// dummy
	// popn_cnty = [...popn_cnty, {id: 'Kiambu', count: 54}, {id: 'Nakuru', count:13}, {id: 'Machakos', count: 5}, {id: "Murang'a", count: 1}, { id: 'Homa bay', count: 17}, {id: 'Kilifi', count: 13},  {id: 'Uasin gishu', count: 23}, {id: 'Taita taveta', count: 23}, {id: "Makueni", count: 7}, {id: "Kajiado", count: 11}, {id: "Narok", count: 4}, {id: "Kericho", count: 2}], {id: "Kisii", count: 2}
	// sec = [
	// 	...sec,
	// 	{ id: 'Agriculture', count: 20 },
	// 	{ id: 'Technology', count: 45 },
	// 	{ id: 'Healthcare', count: 32 },
	// 	{ id: 'Education', count: 27 },
	// 	{ id: 'Finance', count: 38 },
	// 	{ id: 'Construction', count: 22 },
	// 	{ id: 'Retail', count: 30 },
	// 	{ id: 'Energy', count: 18 },
	// 	{ id: 'Transportation', count: 25 },
	// 	{ id: 'Entertainment', count: 15 }
	//   ];
	//   edu = [
	// 	{ id: 'Primary', count: 12 },
	// 	{ id: 'Secondary', count: 18 },
	// 	{ id: 'Post-Graduate', count: 25 },
	// 	{ id: 'Vocational', count: 30 },

	//   ];
	return {
		geojson,
		countries: await fetchGeoJsons(),
		popn,
		popn_cnty,
		sec,
		edu,
		analytics,
		total_responses
	};
}) satisfies PageServerLoad;
