import type { Actions, PageServerLoad } from './$types';
import { CURRENCY_EXCHANGE_API } from '$env/static/private';
import { db } from '$lib/server/db';
import { clientData, clientPackages, clientTransactions } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const userid = user?.id as string;
	// const res = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_EXCHANGE_API}/latest/USD`);

	// const data = await res.json();
	// const exchangerate = data.conversion_rates.KES;
	const [details] = await db
		.select({
			phone: clientData.phone
		})
		.from(clientData)
		.where(eq(clientData.clientId, userid));
	return {
		// exchangerate,
		phoneno: details.phone
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { user }, cookies }) => {
		const userid = user?.id as string;
		const data = Object.fromEntries(await request.formData()) as {
			phone: string;
			price: string;
			plan: string;
		};
		const { phone, price, plan } = data;
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
				const [res] = await db
					.select({
						packageid: sql<string>`${clientPackages.packageid}`,
						typeid: sql<string>`
						CASE 
							WHEN ${clientPackages.package_price_mn} = ${dollar_amt}
							THEN ${clientPackages.priceIdMn}
							ELSE ${clientPackages.priceIdYr}
						 END
					`,
						processed: sql<Date>`NOW()::timestamp`,
						expiry: sql<Date>`
						CASE
							WHEN ${clientPackages.package_price_mn} = ${dollar_amt}
							THEN NOW() + interval '30' day
							ELSE NOW() + interval '1' year
						END
					`
					})
					.from(clientPackages)
					.where(eq(clientPackages.packageDesc, plan));
				// and insert
				const { packageid, typeid, processed, expiry } = res;
				await db
					.update(clientData)
					.set({
						packageid,
						typeid,
						payment_status: true,
						processed_at: new Date(processed),
						expires_at: new Date(expiry),
						onetime: plan === 'One-time' ? true : false
					})
					.where(eq(clientData.clientId, userid));
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
