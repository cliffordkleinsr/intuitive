import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { consumerPackage, costTable, SurveyTable, userPackage } from '$lib/server/db/schema';
import {
	createNewSurvey,
	doPriceLookup,
	getpackageFeatures,
	getSubscriptionStatus,
	returnDateValue
} from '$lib/server/db/db_utils';
import { eq, lt, and, ne } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { addDays } from '$lib/custom/functions/helpers';
import { addYears } from 'date-fns';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const consumer_details = await getSubscriptionStatus(user?.id as string);
	// console.log(consumer_details)
	return {
		form: await superValidate(zod(schema)),
		consumer_details
	};
};

export const actions: Actions = {
	default: async ({ locals, request, cookies }) => {
		let userid = locals.user?.id as string;
		let form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		const { title, description } = form.data;
		// const { max_responses, plan, type } = await doPriceLookup(userid);
		const freeTier = {
			plan: 'Free',
			max_responses: 800
		};
		const feature = await db
			.select({
				max_responses: costTable.max_responses,
				plan: costTable.title
			})
			.from(userPackage)
			.leftJoin(costTable, eq(userPackage.package_id, costTable.id))
			.where(eq(userPackage.consumerid, userid))
			.limit(1);
		const features = feature[0] ?? freeTier;
		const today = Date.now();

		const date_val = features.plan === 'Free' ? 0.5 : 1; //returnDateValue(type as string, plan);
		const expiry_date = addYears(today, date_val);
		const uuid = crypto.randomUUID();
		try {
			await db.insert(SurveyTable).values({
				surveyid: uuid,
				consumer_id: userid,
				title: title,
				description: description,
				max_responses: features.max_responses,
				survey_expires: expiry_date
			});
		} catch (err) {
			console.error(err);
			return message(form, {
				alertType: 'error',
				alertText: 'An unexpected error occured'
			});
		}

		redirect(
			303,
			`/client-console/surveys/edit/${uuid}`,
			{ type: 'info', message: 'Survey Generated!' },
			cookies
		);
	}
};
