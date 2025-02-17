import { message, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from './schema';
import bcrypt from 'bcrypt';
import { getEmailUser, getRegistryState } from '$lib/server/db/db_utils';

import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';

export const load = (async ({ locals: { user }, cookies, url }) => {
	const uid = user?.id as string;
	const update_registry = await getRegistryState(uid); //cookies.get('update_registry') ?? null;
	if (Boolean(update_registry)) {
		redirect(
			302,
			handleLoginRedirect('/client-console/update-registry', url),
			{
				type: 'info',
				message: 'Please update registry before proceeding'
			},
			cookies
		);
	}
	if (user) {
		redirect(
			302,
			handleLoginRedirect('/client-console', url),
			{
				type: 'info',
				message: 'User already logged in'
			},
			cookies
		);
	}
	return {
		form: await superValidate(zod(loginSchema))
	};
}) satisfies PageServerLoad;

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
		try {
			// destructure form.data for validation
			const { email, password } = form.data;
			const existingUser = await getEmailUser(email);
			// If user does not exist break
			if (typeof existingUser === 'undefined')
				return setError(form, 'email', 'Email not registered');

			// Verify the password
			const validPassword = await bcrypt.compare(password, existingUser.password as string); //await Bun.password.verify(password, existingUser.password)
			if (!validPassword) return setError(form, 'password', 'Incorrect Password');

			// create a session in the database
			const token = generateSessionToken();
			const session = await createSession(token, existingUser.id);
			setSessionTokenCookie(cookies, token, session.expiresAt);
		} catch (error) {
			console.error(error);
			return message(form, {
				alertType: 'error',
				alertText: `An Unexpected error occured ${error}`
			});
		}

		// redirect
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo)
			redirect(
				302,
				`/${redirectTo.slice(1)}`,
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		redirect(
			302,
			'/client-console',
			{ type: 'success', message: 'Logged In Successfully' },
			cookies
		);
	}
};
