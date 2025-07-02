import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { fileSchema } from './schema';
import { csvParse, autoType } from 'd3-dsv';
import { agentData, UsersTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { calculateAge } from '$lib/custom/functions/helpers';

export const load = (async () => {
	return {
		form: await superValidate(zod(fileSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { user }, url, params }) => {
		const form = await superValidate(request, zod(fileSchema));
		// validate
		if (!form.valid) {
			return message(form, {
				alertType: 'error',
				alertText: 'Please Check your entries, the form contains invalid data'
			});
		}
		try {
			// Parse CSV
			const c2j = csvParse(await form.data.csv.text(), autoType);
			let cols: any[] = c2j.columns;
			if (!cols.includes('dob')) {
				return message(form, {
					alertType: 'warning',
					alertText: 'The data is not in the expected format. Use the agentdata column schema'
				});
			}
			await db.transaction(async (tx) => {
				c2j.map(async (items: any) => {
					const { agent_id, dob, county, subcounty, sector, income, employment, education } = items;

					// Validate required fields
					if (!agent_id) {
						throw new Error('agent_id is required');
					}
					// console.log(items)
					await tx
						.update(agentData)
						.set({
							dateofbirth: dob,
							county,
							subcounty,
							sector,
							income,
							employment,
							education
						})
						.where(eq(agentData.agentid, agent_id));

					await tx
						.update(UsersTable)
						.set({
							age: calculateAge(dob)
						})
						.where(eq(UsersTable.id, agent_id));
				});
			});
			return message(form, {
				alertType: 'success',
				alertText: 'Data updated successfully'
			});
		} catch (error) {
			console.error('Error updating data:', error);
			return message(form, {
				alertType: 'error',
				alertText:
					'Failed to update data: ' + (error instanceof Error ? error.message : 'Unknown error')
			});
		}
	}
};
