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
	// if (user.role === 'AGENT') {
	// 	redirect(
	// 		302,
	// 		handleLoginRedirect('/', url),
	// 		{
	// 			type: 'error',
	// 			message: 'Not Allowed'
	// 		},
	// 		cookies
	// 	);
	// }

	// if (validate) {
	// 	const [res] = await db.select().from(UsersTable).where(eq(UsersTable.id, user.id));
	// 	if (!res.isEmailVerified) {
	// 		redirect(
	// 			302,
	// 			handleLoginRedirect('/verify/email', url),
	// 			{
	// 				type: 'info',
	// 				message: 'Email not verified'
	// 			},
	// 			cookies
	// 		);
	// 	}
	// }
	// old client
	if (use_old) {
		const [features, , , payment, is_onetime] = await Promise.all([
			// get features
			getpackageFeatures(user.id),
			// expire package
			expirePackage(user.id),
			// expire survey
			disableOldSurvey(user.id),
			// payment status
			getOldPaymentStatus(user.id),
			// is onetime used
			checkOnetime(user.id)
		]);
		return {
			payment: payment.status,
			features,
			user,
			is_onetime,
			use_old
		};
	} else {
		// get features
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
	}
	// const features = await getpackageFeatures(user.id);

	// const msg = [];
	// if they have a plan go a head and check if its expired
	// if (features) {
	// 	if (features.plan !== null) {
	// 		const expiry_date = await retExpiryDate(user.id);
	// 		const { expiry } = expiry_date;
	// 		// to disable plans that have expired
	// 		if (new Date(expiry) < new Date()) {
	// 			const expired = await setpackageExpired(user.id, expiry_date);
	// 			msg.push(expired?.message);
	// 		}
	// 	}
	// }

	// notifs
	// to disable expired surveys
	// const live = await db
	// 	.select({
	// 		sid: SurveyTable.surveyid,
	// 		to: SurveyTable.to
	// 	})
	// 	.from(SurveyTable)
	// 	.where(sql`${SurveyTable.status} = 'Live' and ${SurveyTable.clientid} = ${user.id}`);

	// for (const i of live) {
	// const message = await checkDate(i.sid, i.to!, user.id);
	// 	msg.push(message?.message);
	// }

	// Features and payment plans
	// const [payment] = await db
	// 	.select({
	// 		status: clientData.payment_status
	// 	})
	// 	.from(clientData)
	// 	.where(sql`${clientData.clientId} = ${user.id}`);

	// const sharable = await db
	// 	.select({
	// 		id: SurveyTable.surveyid,
	// 		title: SurveyTable.surveyTitle,
	// 		createdAt: sql<Date>`${SurveyTable.createdAt}::date`
	// 	})
	// 	.from(SurveyTable)
	// 	.where(
	// 		sql`
	// 			${SurveyTable.external} = true
	// 			and
	// 			${SurveyTable.status} = 'Live'
	// 			and
	// 			${SurveyTable.clientid} = ${user.id}
	// 		`
	// 	);
	// const [onetime] = await db
	// 	.select({
	// 		state: clientData.onetime
	// 	})
	// 	.from(clientData)
	// 	.where(eq(clientData.clientId, user.id as string));
	// return {
	// 	payment,
	// 	features,
	// 	AuthedUser: user.fullname,
	// 	profile: user.pfp,
	// 	Role: user.role,
	// 	email: user.email,
	// 	url: url.pathname,
	// 	notif: msg,
	// 	share: sharable.length,
	// 	sharable,
	// 	otp: onetime.state
	// };
};
