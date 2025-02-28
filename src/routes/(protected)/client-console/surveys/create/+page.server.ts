import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { SurveyTable } from '$lib/server/db/schema';
import {
	createNewSurvey,
	doPriceLookup,
	getpackageFeatures,
	returnDateValue
} from '$lib/server/db/db_utils';
import { eq, sql } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { addDays } from '$lib/custom/functions/helpers';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	return { form: await superValidate(zod(schema)) };
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
		const { max_responses, plan, type } = await doPriceLookup(userid);
		const today = Date.now();

		const date_val = returnDateValue(type as string, plan);
		const expiry_date = addDays(today, date_val);
		const uuid = crypto.randomUUID();
		try {
			await db.insert(SurveyTable).values({
				surveyid: uuid,
				consumer_id: userid,
				title: title,
				description: description,
				max_responses: max_responses,
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
