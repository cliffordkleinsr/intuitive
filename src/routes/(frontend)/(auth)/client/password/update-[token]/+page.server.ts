import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetpasSchema } from './schema';
import { db } from '$lib/server/db';
import { passwordReset, UsersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {
		form: await superValidate(zod(resetpasSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params: { token } }) => {
		const form = await superValidate(request, zod(resetpasSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		// destructure
		const { password } = form.data;
		// find the user
		const unique_token = token as string;
		const [user] = await db
			.select({
				email: passwordReset.email
			})
			.from(passwordReset)
			.where(eq(passwordReset.token, unique_token));

		try {
			// cannot use old password
			const [existingUser] = await db
				.select()
				.from(UsersTable)
				.where(eq(UsersTable.email, user.email));

			const validPassword = await bcrypt.compare(password, existingUser.password);
			if (validPassword) {
				return setError(form, 'password', 'New password cannot be your old password');
			}
			// update their passwords
			const hashPassword = await bcrypt.hash(password, 15);
			await db
				.update(UsersTable)
				.set({
					password: hashPassword
				})
				.where(eq(UsersTable.email, user.email));

			// Remove the token from the database
			await db.delete(passwordReset).where(eq(passwordReset.token, unique_token));
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		redirect(302, `/client/password/update-${unique_token}/success`);
	}
};
