import { db } from '$lib/server/db';
import { utmSourceTracking } from '$lib/server/db/schema';
import { and, isNotNull, count, desc, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const sources = await db.select().from(utmSourceTracking);
	// console.log(sources)
	const external = await db
		.select()
		.from(utmSourceTracking)
		.where(
			and(
				isNotNull(utmSourceTracking.utmSource),
				isNotNull(utmSourceTracking.utmMedium),
				isNotNull(utmSourceTracking.utmCampaign)
			)
		);
	const direct = await db
		.select()
		.from(utmSourceTracking)
		.where(
			and(
				isNull(utmSourceTracking.utmSource),
				isNull(utmSourceTracking.utmMedium),
				isNull(utmSourceTracking.utmCampaign)
			)
		);
	// const total_direct = sources.length - external.length;
	const t_sauce = await db
		.select({
			source: utmSourceTracking.utmSource,
			count: count(utmSourceTracking.utmSource)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmSource)
		.orderBy(desc(utmSourceTracking.utmSource));
	const top_source = t_sauce.length ? t_sauce.reduce((a, b) => (b.count > a.count ? b : a)) : null;
	// console.log(top_source)
	let source_distribution = await db
		.select({
			source: utmSourceTracking.utmSource,
			count: count(utmSourceTracking.utmSource)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmSource)
		.orderBy(desc(utmSourceTracking.utmSource));
	// console.log(source_distribution)
	let medium_distribution = await db
		.select({
			medium: utmSourceTracking.utmMedium,
			count: count(utmSourceTracking.utmMedium)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmMedium)
		.orderBy(desc(utmSourceTracking.utmMedium));

	let campaign_distribution = await db
		.select({
			campaign: utmSourceTracking.utmCampaign,
			count: count(utmSourceTracking.utmCampaign)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmCampaign)
		.orderBy(desc(utmSourceTracking.utmCampaign));

	// source_distribution = [
	// 	{
	// 		source: 'facebook',
	// 		count: 7111
	// 	},
	// 	{
	// 		source: 'google',
	// 		count: 2000
	// 	},
	// 	{
	// 		source: 'instagram',
	// 		count: 500
	// 	},
	// 	{
	// 		source: 'linkedin',
	// 		count: 8
	// 	}
	// ];
	// medium_distribution = [
	// 	{
	// 		medium: 'Cpc ',
	// 		count: 17756
	// 	},
	// 	{
	// 		medium: 'paid social',
	// 		count: 26
	// 	},
	// 	{
	// 		medium: 'Social',
	// 		count: 6
	// 	}
	// ];
	// campaign_distribution = [
	// 	{
	// 		campaign: 'social media campaign ',
	// 		count: 156
	// 	},
	// 	{
	// 		campaign: 'automotive parts tyres',
	// 		count: 2556
	// 	},
	// 	{
	// 		campaign: 'spare parts',
	// 		count: 64654
	// 	}
	// ];

	return {
		sources,
		external,
		direct,
		top_source,
		source_distribution,
		medium_distribution,
		campaign_distribution
	};
}) satisfies PageServerLoad;
