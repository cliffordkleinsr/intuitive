import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as auth from '$lib/server/auth.js'
import { deleteSessionTokenCookie } from '$lib/server/session';
import { redirect } from 'sveltekit-flash-message/server';
export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401, { message: 'You do not have a valid sesion' });
		}
		await auth.invalidateSession(locals.session.id);
		deleteSessionTokenCookie(cookies)
		redirect(302, '/client/signin', { type: 'success', message: 'Logged Out' }, cookies);
	}
};
