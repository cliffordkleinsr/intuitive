import type { Actions, PageServerLoad } from './$types';
// import { CURRENCY_EXCHANGE_API } from '$env/static/private';
import { db } from '$lib/server/db';
import {
	clientData,
	clientPackages,
	clientTransactions,
	consumerDeats,
	consumerPackage,
	pricingTable
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { billingSchema } from './billing';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;

	const [details] = await db
		.select({
			phone: consumerDeats.phone
		})
		.from(consumerDeats)
		.where(eq(consumerDeats.consumerid, userid));
	return {
		form: await superValidate(zod(billingSchema)),
		phoneno: details.phone
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { user }, cookies }) => {
		const userid = user?.id as string;
		const form = await superValidate(request, zod(billingSchema));
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
		const { phone, price, plan, packagetype } = form.data as BillingItems;

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
				(${clientTransactions.TransTime} - NOW()) < interval '1' day
				`
			);
		try {
			if (details.length > 0) {
				const dollar_amt = parseInt(price) / 100;
				let date_val =
					packagetype === 'advanced' || packagetype === 'advantage'
						? 365
						: plan !== 'Enterprise'
							? 30
							: 90;
				const [lookup] = await db
					.select({
						packageid: pricingTable.id
					})
					.from(pricingTable)
					.where(eq(pricingTable.title, plan));

				await db.update(consumerPackage).set({
					consumerid: userid,
					package_id: lookup.packageid,
					package: plan,
					package_type: packagetype,
					invoiced: new Date(),
					expires: new Date(new Date().getDate() + date_val)
				});
				// const [res] = await db
				// 	.select({
				// 		packageid: sql<string>`${clientPackages.packageid}`,
				// 		typeid: sql<string>`
				// 		CASE
				// 			WHEN ${clientPackages.package_price_mn} = ${dollar_amt}
				// 			THEN ${clientPackages.priceIdMn}
				// 			ELSE ${clientPackages.priceIdYr}
				// 		 END
				// 	`,
				// 		processed: sql<Date>`NOW()::timestamp`,
				// 		expiry: sql<Date>`
				// 		CASE
				// 			WHEN ${clientPackages.package_price_mn} = ${dollar_amt}
				// 			THEN NOW() + interval '30' day
				// 			ELSE NOW() + interval '1' year
				// 		END
				// 	`
				// 	})
				// 	.from(clientPackages)
				// 	.where(eq(clientPackages.packageDesc, plan));
				// // and insert
				// const { packageid, typeid, processed, expiry } = res;
				// await db
				// 	.update(clientData)
				// 	.set({
				// 		packageid,
				// 		typeid,
				// 		payment_status: true,
				// 		processed_at: new Date(processed),
				// 		expires_at: new Date(expiry),
				// 		onetime: plan === 'One-time' ? true : false
				// 	})
				// 	.where(eq(clientData.clientId, userid));
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
