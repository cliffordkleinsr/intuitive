import { message, setError, superValidate } from 'sveltekit-superforms';
import { signinCSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	clientData,
	clientPackages,
	emailVerification,
	sessionsTable,
	UsersTable
} from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth.js';
import { redirect } from 'sveltekit-flash-message/server';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { setSessionTokenCookie } from '$lib/server/session';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		if (user.role === 'CLIENT') {
			// redirect('/client-dash',  {type: "error", message:"User Already Logged In"}, cookies)
			redirect(302, handleLoginRedirect('/client-console', url, 'User Already Logged In'));
		}
	}
	return {
		form: await superValidate(zod(signinCSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(signinCSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// destructure form.data for validation
		const { email, password } = form.data;
		// If form Is valid check if exists
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

		if (existingUser.role === 'AGENT') {
			return setError(
				form,
				'email',
				'User of this type is not allowed, please use the appropriate login form'
			);
		}
		// Verify the password
		const validPassword = await bcrypt.compare(password, existingUser.password);

		if (!validPassword) {
			return setError(form, 'password', 'Incorrect Password');
		}

		// create a session in the database
		const session = await auth.createSession(existingUser.id);
		setSessionTokenCookie(cookies, session.id, session.expiresAt);

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(
				302,
				`/${redirectTo.slice(1)}`,
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		}
		if (existingUser.verified) {
			redirect(
				302,
				'/client-console',
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		} else {
			redirect(
				302,
				'/client/verify/email',
				{ type: 'error', message: 'Email Not Verified!' },
				cookies
			);
		}
	}
};
