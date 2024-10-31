// import type { Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	clientData,
	clientPackages,
	emailVerification,
	SurveyTable,
	UsersTable
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import {
	checkDate,
	deleteCUser,
	deleteSurvey,
	getpackageFeatures,
	retExpiryDate,
	setpackageExpired
} from '$lib/server/db/db_utils';

export const load: LayoutServerLoad = async ({ locals: { user }, url }) => {
	let validate = false;
	if (!user) {
		// redirect('/client/signin', {type: "error", message:"You Must Be logged In to view this page"}, cookies)
		redirect(302, handleLoginRedirect('/client/signin', url));
		// console.log(fromUrl)
	}
	if (user.role === 'AGENT') {
		redirect(302, handleLoginRedirect('/', url, 'Not Authorised'));
	}

	if (validate) {
		const [res] = await db.select().from(UsersTable).where(eq(UsersTable.id, user.id));
		if (!res.isEmailVerified) {
			redirect(302, handleLoginRedirect('/verify/email', url, 'Email not verified'));
		}
	}
	// get client feats
	const features = await getpackageFeatures(user.id);
	let msg = [];
	// if they have a plan go a head and check if its expired
	if (features) {
		if (features.plan !== null) {
			const expiry_date = await retExpiryDate(user.id);
			const { expiry } = expiry_date;
			// to disable plans that have expired
			if (new Date(expiry) < new Date()) {
				const expired = await setpackageExpired(user.id, expiry_date);
				msg.push(expired?.message);
			}
		}
	}

	// notifs
	// to disable expired surveys
	const live = await db
		.select({
			sid: SurveyTable.surveyid,
			to: SurveyTable.to
		})
		.from(SurveyTable)
		.where(sql`${SurveyTable.status} = 'Live' and ${SurveyTable.clientid} = ${user.id}`);

	for (const i of live) {
		const message = await checkDate(i.sid, i.to!, user.id);
		msg.push(message?.message);
	}

	// Features and payment plans
	const [payment] = await db
		.select({
			status: clientData.payment_status
		})
		.from(clientData)
		.where(sql`${clientData.clientId} = ${user.id}`);

	const sharable = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.surveyTitle,
			desc: SurveyTable.surveyDescription
		})
		.from(SurveyTable)
		.where(
			sql`
        ${SurveyTable.external} = true
        and 
        ${SurveyTable.status} = 'Live'
        and
        ${SurveyTable.clientid} = ${user.id}
        `
		);
	return {
		payment,
		features,
		AuthedUser: user.fullname,
		profile: user.pfp,
		Role: user.role,
		email: user.email,
		url: url.pathname,
		notif: msg,
		share: sharable.length,
		sharable
	};
};
