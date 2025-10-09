// import type { Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { fetchGeoJsons, handleLoginRedirect } from '$lib/custom/functions/helpers';
import { db } from '$lib/server/db';
import {
	consumerDeats,
	costTable,
	SurveyTable,
	user_analytics,
	userPackage
} from '$lib/server/db/schema';
import { eq, sql, and, gt } from 'drizzle-orm';
import {
	checkOnetime,
	disableOldSurvey,
	expirePackage,
	getpackageFeatures,
	getOldPaymentStatus,
	doPriceLookup,
	getNewPaymentStatus,
	getRegistryState,
	disableSurvey
} from '$lib/server/db/db_utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async ({ locals: { user }, url, cookies }) => {
	// const validate = false;
	const uid = user?.id as string;
	const update_registry = await getRegistryState(uid);

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

	const freeTier = {
		plan: 'Free',
		price: '0',
		max_responses: 800,
		demographics: false,
		branding: false
	};
	const feature = await db
		.select({
			plan: costTable.title,
			price: costTable.cost,
			max_responses: costTable.max_responses,
			demographics: costTable.demographics,
			branding: costTable.branding
		})
		.from(userPackage)
		.leftJoin(costTable, eq(userPackage.package_id, costTable.id))
		.where(eq(userPackage.consumerid, uid))
		.limit(1);

	const features = feature[0] ?? freeTier;
	const [{ company_name }] = await db
		.select({ company_name: consumerDeats.company_name })
		.from(consumerDeats)
		.where(eq(consumerDeats.consumerid, uid));
	const [pkg] = await db
		.select({
			expires: userPackage.expires,
			title: costTable.title,
			price: costTable.cost
		})
		.from(userPackage)
		.leftJoin(costTable, eq(userPackage.package_id, costTable.id))
		.where(
			and(
				eq(userPackage.consumerid, uid),
				gt(userPackage.expires, new Date()) // still active
			)
		)
		.limit(1);
	const payment = !!pkg;

	const response = await db
		.select()
		.from(user_analytics)
		.leftJoin(SurveyTable, eq(SurveyTable.surveyid, user_analytics.surveyid))
		.where(
			and(
				eq(SurveyTable.consumer_id, uid),
				gt(SurveyTable.created_at, sql`date_trunc('month', NOW())`)
			)
		);
	// const [features, payment] = await Promise.all([
	// 	doPriceLookup(user.id),
	// 	// payment status
	// 	getNewPaymentStatus(user.id),
	// 	// expire survey
	// 	disableSurvey(user.id)
	// ]);

	return {
		features,
		payment,
		user,
		company_name,
		responses: response.length
	};
};
