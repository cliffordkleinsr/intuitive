import { db } from '$lib/server/db';
import { utmSourceTracking } from '$lib/server/db/schema';
import { and, isNotNull, count, desc, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { normalizeCampaign, normalizeUtm } from '$lib/custom/functions/helpers';
import { date } from 'drizzle-orm/mysql-core';

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

	// let source_distribution = await db
	// 	.select({
	// 		source: utmSourceTracking.utmSource,
	// 		count: count(utmSourceTracking.utmSource)
	// 	})
	// 	.from(utmSourceTracking)
	// 	.groupBy(utmSourceTracking.utmSource)
	// 	.orderBy(desc(utmSourceTracking.utmSource));
	let rawSourceDist = await db
		.select({
			source: utmSourceTracking.utmSource,
			count: count(utmSourceTracking.utmSource),
			date: utmSourceTracking.recordedAt
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmSource, utmSourceTracking.recordedAt)
		.orderBy(desc(utmSourceTracking.utmSource));
	// console.log(rawSourceDist)
	let medium_distribution = await db
		.select({
			medium: utmSourceTracking.utmMedium,
			count: count(utmSourceTracking.utmMedium)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmMedium)
		.orderBy(desc(utmSourceTracking.utmMedium));

	let rawCampaignDist = await db
		.select({
			campaign: utmSourceTracking.utmCampaign,
			count: count(utmSourceTracking.utmCampaign)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmCampaign)
		.orderBy(desc(utmSourceTracking.utmCampaign));

	type NormalizedSource = string;

	const source_distribution_lst: Record<NormalizedSource, number> = rawSourceDist.reduce<
		Record<NormalizedSource, number>
	>((acc, row) => {
		const norm = normalizeUtm(row.source);

		if (!acc[norm]) acc[norm] = 0;
		acc[norm] += row.count;

		return acc;
	}, {});

	const source_distribution = Object.entries(source_distribution_lst)
		.map(([source, count]) => ({ source, count }))
		.sort((a, b) => b.count - a.count)
		.filter((f) => f.source !== 'unknown');

	const mergedCampaigns: Record<string, number> = {};

	for (const row of rawCampaignDist) {
		const norm = normalizeCampaign(row.campaign);

		if (!mergedCampaigns[norm]) mergedCampaigns[norm] = 0;
		mergedCampaigns[norm] += row.count;
	}
	const campaign_distribution = Object.entries(mergedCampaigns)
		.map(([campaign, count]) => ({ campaign, count }))
		.sort((a, b) => b.count - a.count)
		.filter((f) => f.campaign !== 'unknown');

	// console.log(source_distribution)
	type RawRow = {
		source: string | null;
		count: number;
		date: Date;
	};

	type NormalizedRow = {
		source: string;
		count: number;
		date: Date;
	};

	const timeseries: NormalizedRow[] = rawSourceDist
		.map((row) => ({
			source: normalizeUtm(row.source), // <-- normalize here
			count: row.count,
			date: row.date
		}))
		.filter((f) => f.source !== 'unknown');

	return {
		sources,
		external,
		direct,
		top_source,
		source_distribution,
		medium_distribution,
		campaign_distribution,
		timeseries
	};
}) satisfies PageServerLoad;
