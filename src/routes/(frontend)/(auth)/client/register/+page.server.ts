import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerCSchema } from './schema';
import { checkIfEmailExists, insertClientData, insertNewUser } from '$lib/server/db/db_utils';
import * as auth from '$lib/server/auth.js';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { emailVerification } from '$lib/server/db/schema';
import { sendVerificationEmail } from '$lib/server/emailconfigs/email-messages';
import { setSessionTokenCookie } from '$lib/server/session';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
	if (user) {
		if (user.role === 'CLIENT') {
			// redirect('/client-dash',  {type: "error", message:"User Already Logged In"}, cookies)
			redirect(302, handleLoginRedirect('/client-dash', url, 'User Already Logged In'));
		}
	}
	return {
		form: await superValidate(zod(registerCSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		let validate = false;
		const form = await superValidate(request, zod(registerCSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		if (form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Not Authorised'
			});
		}
		// await db.delete(emailVerificationCodes)
		// await deleteClientUsers()
		// destructure form.data for some operations and insertions
		const { fullname, email, company, phoneno, county, sector, password } = form.data;

		// check if the email is already registered
		const exists = await checkIfEmailExists(email);

		if (exists) {
			return setError(form, 'email', 'Email already registered');
			// return message(form, {
			//     alertType: 'error',
			//     alertText: 'Email already registered'
			// })
		}

		try {
			const userid = crypto.randomUUID();
			const hashPassword = await bcrypt.hashSync(password, 15);

			await insertNewUser({
				id: userid,
				fullname: fullname,
				email: email,
				password: hashPassword,
				isEmailVerified: !validate, //set to false if you use email verification
				role: 'CLIENT'
			});

			await insertClientData({
				email: email,
				county: county,
				sector: sector,
				phone: phoneno,
				clientId: userid,
				companyName: company
			});

			if (validate) {
				//  EmailVerification
				const token = crypto.randomUUID();
				await db.insert(emailVerification).values({
					userId: userid,
					token: token,
					email: email
				});
				await sendVerificationEmail(form.data.email, encodeURIComponent(token), 'client');
			}

			// const verificationCode = await generateEmailVerificationCode(userid, email)

			// const sendverificationCodeResult = await sendEmailVerificationCode(email, verificationCode)

			// if (!sendverificationCodeResult.success) {
			//     return message(form, {
			//         alertType: 'error',
			//         alertText: sendverificationCodeResult.message
			//     })
			// }

			// const pendingVerificationData = JSON.stringify({id:userid, email:email, role:'CLIENT'})
			// cookies.set(PENDING_VERIFICATION_COOKIE, pendingVerificationData, {
			//     path: '/email-verification'
			// })
			//  create a session in the database
			const session = await auth.createSession(userid);
			setSessionTokenCookie(cookies, '', session.expiresAt);
			// const session = await lucia.createSession(userid, {});
			// const sessionCookie = lucia.createSessionCookie(session.id);

			// cookies.set(sessionCookie.name, sessionCookie.value, {
			// 	path: '.',
			// 	...sessionCookie.attributes
			// });
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}

		// redirect(302, '/email-verification') //for email ver
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
			redirect(302, '/client/verify/email');
		} else {
			redirect(
				303,
				'/client/signin',
				{ type: 'success', message: 'User Registration Successful' },
				cookies
			);
		}
	}
};