import { db } from '$lib/server/db';
import { SurveyTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fileSchema } from './schema';
import { csvParse, autoType } from 'd3-dsv';
import { sendBulkEmailCSV } from '$lib/server/emailconfigs/bulk';
import { ratelimit } from '$lib/server/redis';
import { doPriceLookup, getNewPaymentStatus } from '$lib/server/db/db_utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load = (async ({ params }) => {
	// const { payment } = await parent();
	// if (!payment) {
	// 	redirect(303, '/client-console', { message: 'Not Authorized', type: 'warning' }, cookies);
	// }
	const [shared_surv] = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			description: SurveyTable.description
		})
		.from(SurveyTable)
		.where(eq(SurveyTable.surveyid, params.surveyId));

	return {
		shared_surv,
		form: await superValidate(zod(fileSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { user }, url, params }) => {
		const username = user?.fullname as string;
		const userid = user?.id as string;
		const form = await superValidate(request, zod(fileSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		const payment = await getNewPaymentStatus(userid);
		if (!payment) {
			return message(form, {
				alertType: 'error',
				alertText: 'Your are not authorized to use this automation'
			});
		}
		const { api } = await doPriceLookup(userid);
		if (!api) {
			return message(form, {
				alertType: 'error',
				alertText: 'Your are not authorized to use this automation'
			});
		}
		const { success, reset } = await ratelimit.span.limit(userid);
		if (!success) {
			const totalMinutes = Math.ceil((reset - Date.now()) / (1000 * 60));
			const hours = Math.floor(totalMinutes / 60);
			const minutes = totalMinutes % 60;

			let timeText = '';
			if (hours > 0) {
				timeText += `${hours} hour${hours === 1 ? '' : 's'}`;
				if (minutes > 0) timeText += ` and `;
			}
			if (minutes > 0) {
				timeText += `${minutes} minute${minutes === 1 ? '' : 's'}`;
			}

			return setError(
				form,
				'csv',
				`You are being rate limited, please wait ${timeText} and try again`
			);
		}

		const c2j = csvParse(await form.data.csv.text(), autoType);

		// console.log(c2j)
		if (c2j.columns.filter((el: string) => el.toUpperCase() === 'EMAIL').length === 0) {
			return message(form, {
				alertType: 'info',
				alertText:
					'Your csv does not match the prequisite format. Ensure it appears as in the example below'
			});
		}
		if (c2j.length >= 10) {
			return message(form, {
				alertType: 'info',
				alertText: 'Your CSV entries are too many. please reduce then try again'
			});
		}
		try {
			let href = `${url.origin}/anonymous/${params.surveyId}`;
			// console.log(c2j)
			sendBulkEmailCSV(c2j, href, username, form);
		} catch (err) {
			console.error(err);
		}
		return message(form, {
			alertType: 'success',
			alertText: 'Bulk emails processed successfuly'
		});
	}
};
