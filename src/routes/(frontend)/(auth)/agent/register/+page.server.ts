import { message, setError, superValidate } from 'sveltekit-superforms';
import { registerRSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { checkIfEmailExists, insertNewUser, insertRespData } from '$lib/server/db/db_utils';
import bcrypt from 'bcrypt';
import { calculateAge, handleLoginRedirect } from '$lib/custom/functions/helpers';
import type { Actions, PageServerLoad } from './$types';
import {
	agentData,
	agentSurveysTable,
	smsVerification,
	surveyqnsTableV2,
	UsersTable
} from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth.js';
import { setSessionTokenCookie } from '$lib/server/session';
// import { createVerification } from '$lib/server/twilioconfigs/sms-messages';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	// await db.delete(smsVerification).where(eq(smsVerification.userId, 'vsz9hei4m2dnr18'))
	await db.delete(agentData).where(eq(agentData.agentid, 'gap97uui59cqhm4'));
	await db.delete(UsersTable).where(eq(UsersTable.id, 'gap97uui59cqhm4'));
	if (user) {
		if (user.role === 'AGENT') {
			// redirect('/respondent-dash',  {type: "error", message:"User Already Logged In"}, cookies)
			redirect(302, handleLoginRedirect('/agent-dash', url, 'User Already Logged In'));
		}
	}
	return {
		form: await superValidate(zod(registerRSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		let validate = false;
		const form = await superValidate(request, zod(registerRSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		// destructure form.data for some operations and insertions
		let {
			fullname,
			email,
			password,
			county,
			income,
			employment,
			education,
			sector,
			phoneno,
			dateofbirth,
			gender
		} = form.data;

		income = income ?? '0 - 10000';
		sector = sector ?? ' Others';

		// check if the email is already registered
		const exists = await checkIfEmailExists(email);

		if (exists) {
			return setError(form, 'email', 'Email already registered');
		}
		if (form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Were sorry but you cant register in pilot mode'
			});
		}
		try {
			const userid = crypto.randomUUID();
			const hashPassword = await bcrypt.hash(password, 15);
			let age = calculateAge(dateofbirth);
			await insertNewUser({
				id: userid,
				fullname: fullname,
				email: email,
				password: hashPassword,
				role: 'AGENT',
				isEmailVerified: true, //set to false if you use email verification
				age: age,
				gender: gender
			});

			await insertRespData({
				email: email,
				agentid: userid,
				phone: phoneno,
				dateofbirth: dateofbirth,
				county: county,
				income: income as string,
				employment: employment,
				education: education,
				sector: sector as string
			});

			const extagent = url.searchParams.get('external');

			if (extagent) {
				const total_qns = await db
					.select()
					.from(surveyqnsTableV2)
					.where(eq(surveyqnsTableV2.surveid, extagent));
				await db.insert(agentSurveysTable).values({
					agentid: userid,
					surveyid: extagent,
					points: total_qns.length,
					extagent: true
				});
			}
			if (validate) {
				// SMSVerification
				let foramtted = '+254' + phoneno.slice(1);
				await db.insert(smsVerification).values({
					userId: userid,
					phone: foramtted
				});

				// await createVerification(foramtted);
			}

			// create a session in the database
			const session = await auth.createSession(userid);
			setSessionTokenCookie(cookies, '', session.expiresAt);
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(
				302,
				`/${redirectTo.slice(1)}`,
				{ type: 'success', message: 'Logged In Successfully' },
				cookies
			);
		}

		if (validate) {
			redirect(
				303,
				'/agent/verify',
				{ type: 'success', message: 'User Registration Successful' },
				cookies
			);
		} else {
			redirect(302, '/agent/signin');
		}
	}
};