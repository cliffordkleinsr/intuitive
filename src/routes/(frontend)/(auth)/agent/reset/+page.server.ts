import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { resetSchema } from './schema';
import { db } from '$lib/server/db';
import { agentData, UsersTable } from '$lib/server/db/schema';
import { calculateAge } from '$lib/custom/functions/helpers';
import bcrypt from 'bcrypt';
import { redirect } from 'sveltekit-flash-message/server';
export const load = (async () => {
	return {
		form: await superValidate(zod(resetSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, locals: { user } }) => {
		const form = await superValidate(request, zod(resetSchema));

		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		let { password, county, subctys, income, employment, education, sector, dateofbirth } =
			form.data;
		// console.log(form)
		try {
			const hashPassword = await bcrypt.hash(password, 15);
			const age = calculateAge(dateofbirth);

			await Promise.all([
				db.update(UsersTable).set({
					age,
					password: hashPassword
				}),
				db.update(agentData).set({
					dateofbirth,
					county,
					subcounty: subctys,
					sector,
					income,
					employment,
					education,
					reset: false
				})
			]);

			redirect(
				303,
				'/agent-console',
				{ type: 'success', message: 'Details recorded succesfully' },
				cookies
			);
		} catch (err) {
			console.error(err);
		}
	}
};
