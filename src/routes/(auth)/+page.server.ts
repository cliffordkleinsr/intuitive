import { loginSchema } from '$lib/SharedZod/schema';
import { message, setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { UsersTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth.js';
import bcrypt from 'bcrypt';
import { redirect } from 'sveltekit-flash-message/server';
import { setSessionTokenCookie } from '$lib/server/auth';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';

export const load: PageServerLoad = async ({ locals: { user }, url, cookies }) => {
	if (user) {
		redirect(
			302,
			handleLoginRedirect('/dashboard', url),
			{ type: 'info', message: 'User Already Logged In' },
			cookies
		);
	}
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(loginSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// destructure form.data for validation
		const { email, password } = form.data;

		const [existingUser] = await db
			.select({
				id: UsersTable.id,
				password: UsersTable.password,
				role: UsersTable.role,
				verified: UsersTable.isEmailVerified
			})
			.from(UsersTable)
			.where(eq(UsersTable.email, email));

		// If does not exist
		if (existingUser === undefined) {
			return setError(form, 'email', 'Email not registered');
		}

		// Verify the password
		const validPassword = await bcrypt.compare(password, existingUser.password); //await Bun.password.verify(password, existingUser.password)

		if (!validPassword) {
			return setError(form, 'password', 'Incorrect Password');
		}

		// create a session in the database
		const token = auth.generateSessionToken();
		const session = await auth.createSession(token, existingUser.id);
		setSessionTokenCookie(cookies, token, session.expiresAt);

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(
				302,
				`/${redirectTo.slice(1)}`,
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		} else {
			redirect(302, '/dashboard', { type: 'success', message: 'Logged In Successfully' }, cookies);
		}
	}
};
