import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { zod4 } from 'sveltekit-superforms/adapters';
import { signupSchema } from './schema';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { checkIfEmailExists } from '$lib/server/db/db_utils';
import { consumerDeats, UsersTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import * as auth from '$lib/server/auth.js';

export const load = (async ({ locals: { user }, url, cookies }) => {
	if (user?.role === 'CLIENT') {
		redirect(
			302,
			handleLoginRedirect('/client-console', url),
			{
				type: 'info',
				message: 'User Already Logged In'
			},
			cookies
		);
	}
	return {
		form: await superValidate(zod4(signupSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		// const validate = false;
		const form = await superValidate(request, zod4(signupSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// destructure form.data for some operations and insertions
		const { fullname, email, phoneno, password } = form.data;

		// check if the email is already registered
		const exists = await checkIfEmailExists(email);

		if (exists) {
			return setError(form, 'email', 'Email already registered');
		}

		try {
			const userid = crypto.randomUUID(); // randomUUIDv7();
			const hashPassword = await bcrypt.hashSync(password, 15); //await Bun.password.hash(password)

			await db.transaction(async (tx) => {
				await tx.insert(UsersTable).values({
					id: userid,
					fullname: fullname,
					email: email,
					password: hashPassword,
					role: 'CLIENT'
				});
				await tx.insert(consumerDeats).values({
					consumerid: userid,
					email,
					phone: phoneno.replace(/\s+/g, '')
				});
			});

			//  create a session in the database
			const token = auth.generateSessionToken();
			const session = await auth.createSession(token, userid);
			auth.setSessionTokenCookie(cookies, '', session.expiresAt);
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}

		// redirect(302, '/email-verification') //for email ver
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(
				302,
				`/${redirectTo.slice(1)}`,
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		}

		redirect(
			303,
			'/client/login',
			{ type: 'success', message: 'User Registration Successful' },
			cookies
		);
	}
};
