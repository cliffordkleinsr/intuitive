import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { amountSchema } from './paymt';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { agentData, payoutRequests } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
// import { SECRETKEY_SERVER_ONLY } from '$env/static/private';
// import { paymentRequestreset } from '$lib/server/db/db_utils';
// import { initiateB2C } from '$lib/server/mpesa';
import { deductAmount } from '$lib/custom/functions/helpers';

export const load: PageServerLoad = async ({ locals: { user } }) => {
	const [balance] = await db
		.select({
			pts: agentData.total_points_payable
		})
		.from(agentData)
		.where(eq(agentData.agentid, user?.id as string));
	return {
		form: await superValidate(zod(amountSchema)),
		total_payable: balance.pts
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals: { user } }) => {
		const form = await superValidate(request, zod(amountSchema));

		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		const { amount } = form.data;

		const [agentinfo] = await db
			.select({
				phone: agentData.phone,
				pts: agentData.total_points_payable
			})
			.from(agentData)
			.where(eq(agentData.agentid, user?.id as string));

		// amount can not be more than the balance
		if (amount > agentinfo.pts) {
			return setError(form, 'amount', 'Your account balance is less than the payout');
		}

		try {
			// create a payment request
			let usr = user?.id as string;
			// amounts above 1k must be processed by admin
			if (amount > 1000) {
				await db.insert(payoutRequests).values({
					agentid: usr,
					payout: amount
				});
			}
			// amounts below can be sent out
			else {
				const { phone } = agentinfo;
				const new_amt = deductAmount(amount);
				const body = { amount: new_amt, phoneNumber: phone };
				// console.log(body)
				// const result = await initiateB2C(body)
				// if (result.errorCode) {
				// 	error(404, result.errorCode )
				// }
				// else {
				// append the transaction code
				// await db.insert(agentTransactions).values({
				// 	agentid: usr,
				// 	originatorCID: result.OriginatorConversationID,
				// 	mpesaCID: result.ConversationID,
				// 	amount: amount,
				// })
				// update the payout request
				// await db.insert(payoutRequests).values({
				// 	agentid: usr,
				// 	payout: amount,
				// 	status: 'complete',
				// 	processedby: usr,
				// 	processedAt: new Date()
				// })
				// once complete subtract on the points payable
				// let remnant = agentinfo.pts - amount;
				// await db
				// 	.update(agentData)
				// 	.set({
				// 		total_points_payable: remnant
				// 	})
				// .where(eq(agentData.agentid, usr));
				// }
			}
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		return message(form, {
			alertType: 'success',
			alertText: 'Payment request submitted successfully'
		});
	}
};
