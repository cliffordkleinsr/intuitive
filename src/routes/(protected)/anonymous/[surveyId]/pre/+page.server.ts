import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { schema } from './schema';
import type { NominatimResponse } from '$lib/types';
import { db } from '$lib/server/db';
import { user_analytics } from '$lib/server/db/schema';
import { redirect } from 'sveltekit-flash-message/server';
import { getIpCookie } from '$lib/server/db/db_utils';

export const load = (async ({ cookies, params: { surveyId }, parent }) => {
	const { uri } = await parent();
	let has_started = Boolean(cookies.get('has_started')) ?? false;
	if (has_started) {
		redirect(303, uri, { type: 'warning', message: 'Not allowed survey has began' }, cookies);
	}
	return {
		form: await superValidate(zod(schema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, fetch, params: { surveyId }, cookies }) => {
		const form = await superValidate(request, zod(schema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		const { location, loc, education, sector, uri } = form.data;
		const res = await fetch('/api/nomatim', {
			method: 'POST',
			body: JSON.stringify(location)
		});
		const reverse_coords = (await res.json()) as NominatimResponse;
		const analyzed_country = reverse_coords?.address?.country;
		let country = loc.country;
		let state = loc.state;
		if (analyzed_country) {
			if (loc.country !== analyzed_country) {
				country = analyzed_country;
				state = reverse_coords?.address?.state;
			}
		}
		const ip = getIpCookie(cookies) as string

		try {
			if (loc && education && sector) {
				await db.insert(user_analytics).values({
					surveyid: surveyId as string,
					level_of_education: education,
					sector: sector,
					country: country,
					state: state,
					client_address: ip
				});
			}
			cookies.set('has_started', String(true), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // expires after 7 days
			});
		} catch (err) {
			console.error(err);
			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured',
				err
			});
		}

		redirect(303, uri, { type: 'success', message: 'You can now begin the survey' }, cookies);
	}
};
