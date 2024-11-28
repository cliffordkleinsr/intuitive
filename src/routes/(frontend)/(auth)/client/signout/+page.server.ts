import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as auth from '$lib/server/auth.js';
import { deleteSessionTokenCookie } from '$lib/server/session';
import { redirect } from 'sveltekit-flash-message/server';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
export const actions: Actions = {
	default: async ({ locals: { session }, cookies, url }) => {
		if (!session) {
			// return fail(401, { message: 'You do not have a valid sesion' });
			redirect(
				302,
				handleLoginRedirect('/client/signin', url),
				{
					type: 'info',
					message: 'Not Authorised'
				},
				cookies
			);
		}
		await auth.invalidateSession(session.id);
		deleteSessionTokenCookie(cookies);
		redirect(302, '/client/signin', { type: 'info', message: 'Logged Out' }, cookies);
	}
};
