import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema';
import { consumerDeats, UsersTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { getRegistryState } from '$lib/server/db/db_utils';

export const load = (async ({ cookies, locals: { user } }) => {
	const uid = user?.id as string;
	const update_registry = await getRegistryState(uid); //cookies.get('update_registry') ?? null;

	if (!Boolean(update_registry)) {
		redirect(
			303,
			'/client-console',
			{ type: 'warning', message: 'User already registered' },
			cookies
		);
	}

	return {
		form: await superValidate(zod(schema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { user }, cookies }) => {
		const userid = user?.id as string;
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}

		const [user_data] = await db
			.select({
				id: UsersTable.id
			})
			.from(UsersTable)
			.where(eq(UsersTable.id, userid));
		// destructure form.data for some operations and insertions
		const { company, phoneno, county, subctys, sector, email } = form.data;
		const { id } = user_data;

		try {
			await db
				.update(UsersTable)
				.set({
					email: email
				})
				.where(eq(UsersTable.id, id));
			await db.insert(consumerDeats).values({
				consumerid: id,
				email,
				company_name: company,
				phone: phoneno.replace(/\s+/g, ''),
				county,
				sub_county: subctys,
				sector
			});

			await db
				.update(UsersTable)
				.set({
					update_registry: false
				})
				.where(eq(UsersTable.id, userid));
		} catch (error) {
			console.error(error);
			return message(form, {
				alertType: 'error',
				alertText: `An Unexpected error occured ${error}`
			});
		}
		redirect(
			303,
			'/client-console',
			{ type: 'success', message: 'Registry entry added succesfully' },
			cookies
		);
	}
};
