import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { profileSchema } from './schema';
import { db } from '$lib/server/db';
import { consumerDeats } from '$lib/server/db/schema';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	return {
		form: await superValidate(zod4(profileSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod4(profileSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		const { company, location, sector, phoneno } = form.data;
		try {
			await db
				.update(consumerDeats)
				.set({
					phone: phoneno,
					company_name: company,
					country: location.country,
					state: location.state,
					sector
				})
				.where(eq(consumerDeats.consumerid, locals.user?.id as string));
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		redirect(
			303,
			'/client/login',
			{ type: 'success', message: 'Profile update was successful' },
			cookies
		);
	}
};
