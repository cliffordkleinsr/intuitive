import type { Actions, PageServerLoad } from './$types';
// import { CURRENCY_EXCHANGE_API } from '$env/static/private';
import { db } from '$lib/server/db';
import {
	clientTransactions,
	consumerDeats,
	consumerPackage,
	costTable,
	pricingTable,
	userPackage
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { billingSchema } from './billing';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;

	const [details] = await db
		.select({
			phone: consumerDeats.phone
		})
		.from(consumerDeats)
		.where(eq(consumerDeats.consumerid, userid));
	return {
		form: await superValidate(zod4(billingSchema)),
		phoneno: details.phone
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { user }, cookies }) => {
		const userid = user?.id as string;
		const form = await superValidate(request, zod4(billingSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		interface BillingItems {
			phone: string;
			price: string;
			plan: string;
			packagetype: string;
		}
		const { phone, price, plan } = form.data as BillingItems;

		// check if there is any payment in the database
		const details = await db
			.select()
			.from(clientTransactions)
			.where(
				sql`
				${clientTransactions.BillRefNumber} = ${phone}
				and
				${clientTransactions.TransAmount} = ${price}
				and
				${clientTransactions.TransTime} >= NOW() - interval '1 day'
				`
			);
		try {
			if (details.length > 0) {
				const dollar_amt = parseInt(price) / 100;
				const [lookup] = await db
					.select({
						packageid: costTable.id
					})
					.from(costTable)
					.where(eq(costTable.title, plan));

				let date_val = plan === 'Basic' ? 183 : 365;
				const date = new Date();
				const dv = date.setDate(date.getDate() + date_val);
				await db.insert(userPackage).values({
					consumerid: userid,
					package_id: lookup.packageid,
					transaction_code: details[0].TransactionCode,
					invoiced: new Date(),
					expires: new Date(dv)
				});
				// let date_val =
				// 	packagetype === 'advanced' || packagetype === 'advantage'
				// 		? 365
				// 		: plan !== 'Enterprise'
				// 			? 30
				// 			: 90;
				// const [lookup] = await db
				// 	.select({
				// 		packageid: pricingTable.id
				// 	})
				// 	.from(pricingTable)
				// 	.where(eq(pricingTable.title, plan));
				// const date = new Date();

				// const dv = date.setDate(date.getDate() + date_val);

				// await db.insert(consumerPackage).values({
				// 	consumerid: userid,
				// 	package_id: lookup.packageid,
				// 	transaction_code: details[0].TransactionCode,
				// 	package: plan,
				// 	package_type: packagetype,
				// 	invoiced: new Date(),
				// 	expires: new Date(dv)
				// });
			} else {
				return message(form, {
					alertType: 'info',
					alertText: 'No payment has been recieved. Verify once you"ve paid'
				});
			}
		} catch (err) {
			console.error(err);
		}

		redirect(
			303,
			'/client-console/billing/summary/success',
			{
				type: 'success',
				message: 'Subscribed'
			},
			cookies
		);
	}
};
