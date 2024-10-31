import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401, { message: 'You do not have a valid sesion' });
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/client/signin', { type: 'success', message: 'Logged Out' }, cookies);
	}
};
