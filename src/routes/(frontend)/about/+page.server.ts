import { message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { subjectSchema } from './schema';
import { zod4 } from 'sveltekit-superforms/adapters';
import { sendQuestionEmail } from '$lib/server/emailconfigs/email-messages';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
const limiter = new RetryAfterRateLimiter({
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'inquiry', // Unique cookie name for this limiter
		secret: 'sasa', // Use $env/static/private
		rate: [2, 'd'],
		preflight: true // Require preflight call (see load function)
	}
});

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);
	return {
		form: await superValidate(zod4(subjectSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		// IPUA RATE LTD
		const status = await limiter.check(event);
		const per = Math.round(status.retryAfter / 3600);

		const { request } = event;
		const form = await superValidate(request, zod4(subjectSchema));
		// No way

		if (await limiter.isLimited(event))
			return setError(
				form,
				'subject',
				`You are being rate limited. Please try again after ${per} hours.`
			);

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
				alertText:
					'Thank you for trying to contact us, we are however holding off communications for this phase'
			});
		}
		// destructure
		const { name, email, subject } = form.data;
		try {
			// ksend email
			await sendQuestionEmail(name, email, subject);
		} catch (err) {
			console.error(err);

			return message(form, {
				alertType: 'error',
				alertText: 'An Unexpected error occured'
			});
		}
		return message(form, {
			alertType: 'success',
			alertText: 'Inqury request sent'
		});
	}
};
