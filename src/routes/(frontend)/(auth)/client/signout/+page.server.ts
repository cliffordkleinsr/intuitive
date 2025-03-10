import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as auth from '$lib/server/auth.js';
import { redirect } from 'sveltekit-flash-message/server';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
export const actions: Actions = {
	default: async ({ locals: { session }, cookies, url }) => {
		if (!session) {
			// return fail(401, { message: 'You do not have a valid sesion' });
			redirect(
				302,
				handleLoginRedirect('/client/login', url),
				{
					type: 'info',
					message: 'Not Authorised'
				},
				cookies
			);
		}
		await auth.invalidateSession(session.id);
		auth.deleteSessionTokenCookie(cookies);
		redirect(302, '/client/login', { type: 'info', message: 'Logged Out' }, cookies);
	}
};
