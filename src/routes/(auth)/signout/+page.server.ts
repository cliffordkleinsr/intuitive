import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import * as auth from '$lib/server/auth.js';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals: { session }, cookies, url }) => {
		if (!session) {
			redirect(
				302,
				handleLoginRedirect('/', url),
				{ type: 'info', message: 'Not Authorised' },
				cookies
			);
		}
		await auth.invalidateSession(session.id);
		auth.deleteSessionTokenCookie(cookies);
		redirect(302, '/', { type: 'info', message: 'Logged Out' }, cookies);
	}
};
