import { fail } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import { deleteSessionTokenCookie } from '$lib/server/session';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
export const actions: Actions = {
	default: async ({ locals: { session }, cookies, url }) => {
		if (!session) {
			redirect(302, handleLoginRedirect('/agent/signin', url, 'Not Authorised'));
			// return fail(401, { message: 'You do not have a valid sesion' });
		}
		await auth.invalidateSession(session.id);
		deleteSessionTokenCookie(cookies);
		redirect(302, '/agent/signin', { type: 'success', message: 'Logged Out' }, cookies);
	}
};
