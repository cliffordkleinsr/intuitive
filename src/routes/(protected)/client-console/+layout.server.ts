// import type { Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { db } from '$lib/server/db';
import { UsersTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import {
	checkOnetime,
	disableOldSurvey,
	expirePackage,
	getpackageFeatures,
	getOldPaymentStatus,
	doPriceLookup,
	getNewPaymentStatus,
	getRegistryState
} from '$lib/server/db/db_utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async ({ locals: { user }, url, cookies }) => {
	// const validate = false;
	const uid = user?.id as string;
	const update_registry = await getRegistryState(uid);
	const use_old = false;

	if (!user) {
		redirect(
			302,
			handleLoginRedirect('/client/login', url),
			{ type: 'info', message: 'Log in to view page' },
			cookies
		);
	}

	if (Boolean(update_registry)) {
		redirect(
			303,
			'/client-console/update-registry',
			{ type: 'info', message: 'Please update your registry before proceeding' },
			cookies
		);
	}
	const [features, payment] = await Promise.all([
		doPriceLookup(user.id),
		// payment status
		getNewPaymentStatus(user.id)
		// expire survey
		// disableSurvey(user.id),
	]);

	// console.log(features)
	return {
		features,
		payment,
		use_old,
		user
	};
};
