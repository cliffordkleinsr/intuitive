import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies }) => {
	const { payment } = await parent();

	if (!payment) {
		redirect(303, '/client-console', { type: 'error', message: 'Not Authorized' }, cookies);
	}
};
