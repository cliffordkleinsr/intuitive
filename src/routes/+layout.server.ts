import { db } from '$lib/server/db';
import { utmSourceTracking } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, fetch, request, locals, cookies }) => {
	const userId = locals.user?.id ?? null;
	const data = await fetch('//api.ipify.org?format=json ');
	const loc = await data.json();

	let personaId = cookies.get('persona');
	let hasActiveSession = cookies.get('session_visit');
	// console.log(hasActiveSession)

	try {
		if (!personaId) {
			personaId = crypto.randomUUID();
			await db.insert(utmSourceTracking).values({
				personaId,
				userId: userId,
				utmSource: url.searchParams.get('utm_source'),
				utmMedium: url.searchParams.get('utm_medium'),
				utmCampaign: url.searchParams.get('utm_campaign'),
				userAgent: request.headers.get('user-agent'),
				ipAddress: loc.ip,
				referrer: request.headers.get('referer')
			});
			cookies.set('persona', personaId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
			cookies.set('session_visit', 'active', {
				path: '/'
			});
		} else if (!hasActiveSession) {
			await db.insert(utmSourceTracking).values({
				personaId,
				userId: userId,
				utmSource: url.searchParams.get('utm_source'),
				utmMedium: url.searchParams.get('utm_medium'),
				utmCampaign: url.searchParams.get('utm_campaign'),
				userAgent: request.headers.get('user-agent'),
				ipAddress: loc.ip,
				referrer: request.headers.get('referer')
			});
		}
	} catch (err) {
		console.error(err);
	}
	return {};
}) satisfies LayoutServerLoad;
