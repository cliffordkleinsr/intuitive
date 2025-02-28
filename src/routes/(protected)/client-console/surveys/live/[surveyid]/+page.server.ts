import { db } from '$lib/server/db';
import {
	agentSurveysTable,
	surveyqnsTableV2,
	SurveyTable,
	UsersTable
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ZodError, z } from 'zod';
import { shuffle } from '$lib/custom/functions/helpers';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ params }) => {
	const [surveys] = await db
		.select({
			id: SurveyTable.surveyid,
			title: SurveyTable.title,
			desc: SurveyTable.description
		})
		.from(SurveyTable)
		.where(eq(SurveyTable.surveyid, params.surveyid));

	return {
		survey_data: surveys
	};
};

export const actions: Actions = {
	goLive: async ({ request, params }) => {
		type SurveyTimes = {
			from: string;
			to: string;
			target: string;
			target_age_group: string;
			target_gender: string;
		};
		const data = Object.fromEntries(await request.formData()) as SurveyTimes;
		const { from, to, target, target_age_group, target_gender } = data;
		if (target === '' || target_age_group === '' || target_gender === '') {
			return fail(400, {
				errors: {
					message: 'Entries age and gender cannot be empty'
				}
			});
		}

		let starting = new Date(from);
		let ending = new Date(to);

		const ages: number[] = target_age_group.split('-').map(Number);
		const total_qns = await db
			.select()
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyid));
		const sq = await db
			.select({
				agentid: UsersTable.id
			})
			.from(UsersTable)
			.where(
				sql`
                    (${target_gender} = 'any' or ${target_gender} = ${UsersTable.gender})   
                    and 
                    ${UsersTable.age} between ${ages[0]} and ${ages[1]}
                    and
                    ${UsersTable.role} = 'AGENT'
                    and
                    ${UsersTable.disabled} = false
                `
			);
		/**
		 * Carry out an unbiased shuffling on the subquery array
		 * Reference: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
		 * Then capture only the first elements based on the target
		 **/
		shuffle(sq);
		const matching_agents = sq.slice(0, parseInt(target));

		/**
		 * Now add a surveyId Object so that we can multi append
		 */
		type Matcher = {
			agentid: string;
			surveyid: string;
			points: number;
		};
		let map: Matcher[] = [];
		matching_agents.forEach((object) => {
			map = [...map, { ...object, surveyid: params.surveyid, points: total_qns.length }];
		});

		try {
			await db
				.update(SurveyTable)
				.set({
					status: 'Live',
					from: starting,
					to: ending,
					target: parseInt(target),
					target_age: target_age_group,
					target_gender: target_gender,
					updatedAt: new Date()
				})
				.where(eq(SurveyTable.surveyid, params.surveyid));

			await db.insert(agentSurveysTable).values(map);
		} catch (err) {
			if (err instanceof ZodError) {
				// Handle Zod validation errors
				const { fieldErrors: errors } = err.flatten();

				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}

		redirect(303, '/client-console');
	},

	shareLive: async ({ request, params }) => {
		const EntrySchema = z.object({
			from: z.coerce.date(),
			to: z.coerce.date()
		});
		const data = Object.fromEntries(await request.formData());

		try {
			const { from, to } = EntrySchema.parse(data);
			await db
				.update(SurveyTable)
				.set({
					status: 'Live',
					from,
					to,
					external: true,
					updatedAt: new Date()
				})
				.where(eq(SurveyTable.surveyid, params.surveyid));
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return fail(400, {
					errors
				});
			} else {
				console.error(err);
			}
		}
		redirect(303, '/client-console');
	}
};
