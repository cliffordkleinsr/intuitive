import { db } from '$lib/server/db';
import { utmSourceTracking } from '$lib/server/db/schema';
import { and, not, eq, sql, isNull, isNotNull, count, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { utmBuilder } from './schema';

export const load = (async () => {
	const sources = await db.select().from(utmSourceTracking);
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
	const total_direct = sources.length - external.length;
	const [top_source] = await db
		.select({
			source: utmSourceTracking.utmSource,
			count: count(utmSourceTracking.utmSource)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmSource)
		.orderBy(desc(utmSourceTracking.utmSource));

	let source_distribution = await db
		.select({
			source: utmSourceTracking.utmSource,
			count: count(utmSourceTracking.utmSource)
		})
		.from(utmSourceTracking)
		.groupBy(utmSourceTracking.utmSource)
		.orderBy(desc(utmSourceTracking.utmSource));

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
	source_distribution = [
		{
			source: 'facebook',
			count: 7111
		},
		{
			source: 'google',
			count: 2000
		},
		{
			source: 'instagram',
			count: 500
		},
		{
			source: 'linkedin',
			count: 8
		}
	];
	medium_distribution = [
		{
			medium: 'Cpc ',
			count: 17756
		},
		{
			medium: 'paid social',
			count: 26
		},
		{
			medium: 'Social',
			count: 6
		}
	];
	campaign_distribution = [
		{
			campaign: 'social media campaign ',
			count: 156
		},
		{
			campaign: 'automotive parts tyres',
			count: 2556
		},
		{
			campaign: 'spare parts',
			count: 64654
		}
	];

	return {
		form: await superValidate(zod(utmBuilder)),
		sources,
		external,
		total_direct,
		top_source,
		source_distribution,
		medium_distribution,
		campaign_distribution
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(utmBuilder));
		console.debug(form.data);
		// validate
		if (!form.valid) {
			// return message(form, {
			// 	alertType: 'error',
			// 	alertText: 'Please Check your entries, the form contains invalid data'
			// });
			return fail(400, {
				form
			});
		}

		return {
			form
		};
	}
};
