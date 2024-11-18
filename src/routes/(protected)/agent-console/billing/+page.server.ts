import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { amountSchema } from './paymt';
import { zod } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { agentData, agentTransactions, payoutRequests } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
// import { SECRETKEY_SERVER_ONLY } from '$env/static/private';
import { paymentRequestreset } from '$lib/server/db/db_utils';
import { initiateB2C } from '$lib/server/mpesa';
import { deductAmount } from '$lib/custom/functions/helpers';
import { ratelimit } from '$lib/server/redis';



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
		let userid = user?.id as string

		const form = await superValidate(request, zod(amountSchema));

		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}


		const { success, reset } = await ratelimit.create.limit(userid)
		if (!success) {
			const totalMinutes = Math.ceil((reset - Date.now()) / (1000 * 60))
			const hours = Math.floor(totalMinutes / 60)
			const minutes = totalMinutes % 60
			
			let timeText = ''
			if (hours > 0) {
				timeText += `${hours} hour${hours === 1 ? '' : 's'}`
				if (minutes > 0) timeText += ` and `
			}
			if (minutes > 0) {
				timeText += `${minutes} minute${minutes === 1 ? '' : 's'}`
			}
			
			return setError(form, 'amount', `You are being rate limited, please wait ${timeText} and try again`)
		}
		const { amount } = form.data;

		const [agentinfo] = await db
			.select({
				phone: agentData.phone,
				pts: agentData.total_points_payable
			})
			.from(agentData)
			.where(eq(agentData.agentid, userid));

		// amount can not be more than the balance
		if (amount > agentinfo.pts) {
			return setError(form, 'amount', 'Your account balance is less than the payout');
		}

		try {
			// create a payment request
			// amounts above 1k must be processed by admin
			if (amount > 1000) {
				await db.insert(payoutRequests).values({
					agentid: userid,
					payout: amount
				});
			}
			// amounts below can be sent out
			else {
				const { phone } = agentinfo;
				const new_amt = deductAmount(amount);
				const body = { amount: new_amt, phoneNumber: phone };
				// console.log(body)
				const result = await initiateB2C(body)

				if (result.errorCode) {
					return message(form, {
						alertType: 'error',
						alertText: `Error ${result.errorCode} , Please contact support`
					});
					// error(404, result.errorCode )
				}
				else {
					// append the transaction code
					await db.insert(agentTransactions).values({
						agentid: userid,
						originatorCID: result.OriginatorConversationID,
						mpesaCID: result.ConversationID,
						amount: amount,
					})
					// update the payout request
					await db.insert(payoutRequests).values({
						agentid: userid,
						payout: amount,
						status: 'complete',
						processedby: userid,
						processedAt: new Date()
					})
					// once complete subtract on the points payable
					let remnant = agentinfo.pts - amount;
					await db
						.update(agentData)
						.set({
							total_points_payable: remnant
						})
					.where(eq(agentData.agentid, userid));
					// & append the points paid
					const [totals] = await db
					.select({
						paid: agentData.total_pts_paid
					})
					.from(agentData)
					.where(eq(agentData.agentid, userid))
					const accrued = totals.paid + amount
					// update the payed amounts
					await db
						.update(agentData)
						.set({
							total_pts_paid: accrued
						})
					.where(eq(agentData.agentid, userid));
				}
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
