import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { emailSchema } from './schema';
import { checkIfEmailExists } from '$lib/server/db/db_utils';
import { db } from '$lib/server/db';
import { passwordReset } from '$lib/server/db/schema';
import { sendPasswordResetEmail } from '$lib/server/emailconfigs/email-messages';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {
		form: await superValidate(zod(emailSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(emailSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// destructure
		const { email } = form.data;

		const token = crypto.randomUUID();

		// check if the email is already registered
		const exists = await checkIfEmailExists(email);
		if (!exists) {
			return setError(form, 'email', 'This email isnt registered');
		}

		try {
			// insert the request token
			await db.insert(passwordReset).values({
				email,
				token
			});
			// send email
			await sendPasswordResetEmail(email, token, 'client');
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		redirect(302, '/client/password/reset/success');
	}
};
