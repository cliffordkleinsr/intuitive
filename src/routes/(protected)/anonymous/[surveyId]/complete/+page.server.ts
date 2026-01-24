import type { Actions, PageServerLoad } from './$types';
import { feedbackSchema } from './schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { db } from '$lib/server/db';
import { feedbackCollection } from '$lib/server/db/schema';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async () => {
	return {
		form: await superValidate(zod4(feedbackSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const form = await superValidate(request, zod4(feedbackSchema));
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		const { name, email, feedback } = form.data;
		try {
			await db.insert(feedbackCollection).values({
				name,
				email,
				feedback
			});
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		return redirect(
			302,
			`/anonymous/${params.surveyId}/complete/closetab`,
			{
				type: 'success',
				message: 'Thank you for your feedback'
			},
			cookies
		);
	}
};
