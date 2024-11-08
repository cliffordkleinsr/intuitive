import { db } from '$lib/server/db';
import { AnswersTable, surveyqnsTableV2 } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { questionZodSchema, rateZodSchema, rankansZodSchema, checkboxansZodSchema } from './zodSch';
import {
	getpersistentIx,
	questionCount,
	getsurveyQuestions,
	insertprogressData,
	selectProgressData,
	setTarget,
	deleteProgressData,
	updateprogressData,
	setsurveyComplete,
	updatesurveyPoints
} from '$lib/server/db/db_utils';
import { handleLoginRedirect } from '$lib/custom/functions/helpers';
import { ZodError } from 'zod';

export const load: PageServerLoad = async ({ params, cookies, locals: { user }, url }) => {
	// curr
	if (!user) {
		redirect(302, handleLoginRedirect('/agent/signin', url));
		// redirect('/respondent/signin', {type: "error", message:"You Must Be logged In to view this page"}, cookies)
	}

	// await db.delete(AnswersTable).where(eq(AnswersTable.surveid, params.surveyId))
	const surveyqns = await getsurveyQuestions(params.questionId);
	// for percentages
	const ids = await questionCount(params.surveyId);
	// await db.delete(progressTable).where(eq(progressTable.surveyid, "wncpwl3rf3h2zes"))
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');
	if (current_ix === 0) {
		// check whether we have a persistent ix
		current_ix = await getpersistentIx(user?.id!, params.surveyId);
	}
	const sq = await selectProgressData(user?.id!, params.surveyId);
	if (sq.length === 0) {
		await insertprogressData({
			agentid: user?.id as string,
			current_ix: current_ix,
			surveyid: params.surveyId
		});
	}
	return {
		count: current_ix,
		questions: surveyqns[0],
		question_cnt: ids.length
	};
};

export const actions: Actions = {
	defaultAns: async ({ request, params, cookies, locals }) => {
		const data = Object.fromEntries(await request.formData());
		// let map: any[] = []
		// data.forEach(element => {
		//     map = [...map, {answer: element} as {answer: string}]

		// })
		// console.log(map)
		const ids = await db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyId))
			.orderBy(asc(surveyqnsTableV2.updatedAt));

		let current_ix = parseInt(cookies.get('current_ix') ?? '0');
		if (current_ix === 0) {
			// check whether we have a persistent ix
			current_ix = await getpersistentIx(locals.user?.id!, params.surveyId);
		}

		if (data.answer === 'undefined')
			return fail(400, {
				warnings: {
					message: 'Please select an option'
				}
			});
		try {
			// validate
			const { answer } = questionZodSchema.parse(data);

			await db.insert(AnswersTable).values({
				questionId: params.questionId,
				surveid: params.surveyId,
				answer: answer,
				agentId: locals.session?.userId as string
			});
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
		// Dynamic routing with incremental counter

		if (current_ix < ids.length - 1) {
			current_ix++;
			// Set the updated current_ix in the cookie
			cookies.set('current_ix', current_ix.toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 5 // expires after 5 mins
			});
			await updateprogressData(locals.user?.id!, params.surveyId, current_ix);
			redirect(303, `/agent-console/surveys/take/${params.surveyId}/${ids[current_ix].id}`);
		} else {
			// Set the cookie to expire then
			cookies.set('current_ix', '0', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0 // Expire the cookie immediately
			});
			// clear the persistent index also
			await deleteProgressData(locals.user?.id!, params.surveyId);
			// set the new target since this guy cant do the survey again
			await setTarget(params.surveyId);
			// update points
			await updatesurveyPoints(locals.user?.id!, params.surveyId);
			// set the survey as complete
			await setsurveyComplete(locals.user?.id!, params.surveyId);
			//then redirect
			redirect(303, '/agent-console/surveys/take/complete');
		}
	},
	addCheckAns: async ({ request, cookies, params, locals }) => {
		const data = await request.formData();
		// console.log(data)
		const map: any[] = [];
		data.forEach((value, name) => {
			if (name === 'optionId') {
				map.push({ id: value });
			} else if (name === 'answer') {
				const lastItem = map[map.length - 1];
				lastItem.answer = value;
			}
		});
		const filtered = map.filter((obj) => obj.hasOwnProperty('answer'));
		const ids = await db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyId))
			.orderBy(asc(surveyqnsTableV2.updatedAt));

		let current_ix = parseInt(cookies.get('current_ix') ?? '0');
		if (current_ix === 0) {
			// check whether we have a persistent ix
			current_ix = await getpersistentIx(locals.user?.id!, params.surveyId);
		}
		if (filtered.length === 0) {
			return fail(400, {
				warnings: {
					message: 'Plese select something before proceeding'
				}
			});
		}

		try {
			for (const insert of filtered) {
				//validate
				const { answer, id } = checkboxansZodSchema.parse(insert);
				await db.insert(AnswersTable).values({
					questionId: params.questionId,
					surveid: params.surveyId,
					optionId: id,
					answer: answer,
					agentId: locals.session?.userId as string
				});
			}
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
		// Dynamic routing with incremental counter

		if (current_ix < ids.length - 1) {
			current_ix++;
			// Set the updated current_ix in the cookie
			cookies.set('current_ix', current_ix.toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 5 // expires after 5 mins
			});
			// update the persistent index
			await updateprogressData(locals.user?.id!, params.surveyId, current_ix);

			redirect(303, `/agent-console/surveys/take/${params.surveyId}/${ids[current_ix].id}`);
		} else {
			// Set the cookie to expire then
			cookies.set('current_ix', '0', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0 // Expire the cookie immediately
			});

			// clear the persistent index also
			await deleteProgressData(locals.user?.id!, params.surveyId);
			// set the new target since this guy cant do the survey again
			await setTarget(params.surveyId);
			// update points
			await updatesurveyPoints(locals.user?.id!, params.surveyId);
			// set the survey as complete
			await setsurveyComplete(locals.user?.id!, params.surveyId);
			//then redirect
			redirect(303, '/agent-console/surveys/take/complete');
		}
	},
	addRankAns: async ({ request, params, cookies, locals }) => {
		const data = await request.formData();

		const map: string | any[] = [];
		data.forEach((value, name) => {
			// console.log(element)
			if (name === 'rankId') {
				map.push({ id: value });
			} else if (name === 'option') {
				const lastItem = map[map.length - 1];
				lastItem.option = value;
			}
		});

		const filtered = map.filter((obj) => obj.hasOwnProperty('option'));
		// console.log(filtered)
		const ids = await db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyId))
			.orderBy(asc(surveyqnsTableV2.updatedAt));

		let current_ix = parseInt(cookies.get('current_ix') ?? '0');
		if (current_ix === 0) {
			// check whether we have a persistent ix
			current_ix = await getpersistentIx(locals.user?.id!, params.surveyId);
		}

		try {
			// console.log(filtered)
			for (const insert of filtered) {
				// console.log(insert)
				//validate
				const { id, option } = rankansZodSchema.parse(insert);
				await db.insert(AnswersTable).values({
					questionId: params.questionId,
					surveid: params.surveyId,
					rankId: id,
					answer: option,
					agentId: locals.session?.userId as string
				});
			}
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
		// Dynamic routing with incremental counter
		if (current_ix < ids.length - 1) {
			current_ix++;
			// Set the updated current_ix in the cookie
			cookies.set('current_ix', current_ix.toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 5 // expires after 5 mins
			});
			// update the persistent index
			await updateprogressData(locals.user?.id!, params.surveyId, current_ix);

			redirect(303, `/agent-console/surveys/take/${params.surveyId}/${ids[current_ix].id}`);
		} else {
			// Set the cookie to expire then
			cookies.set('current_ix', '0', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0 // Expire the cookie immediately
			});
			// clear the persistent index also
			await deleteProgressData(locals.user?.id!, params.surveyId);
			// set the new target since this guy cant do the survey again
			await setTarget(params.surveyId);
			// update points
			await updatesurveyPoints(locals.user?.id!, params.surveyId);
			// set the survey as complete
			await setsurveyComplete(locals.user?.id!, params.surveyId);
			//then redirect
			redirect(303, '/agent-console/surveys/take/complete');
		}
	},
	addRatAns: async ({ request, params, cookies, locals }) => {
		const data = Object.fromEntries(await request.formData());
		// let map: any[] = []
		// data.forEach(element => {
		//     map = [...map, {answer: element} as {answer: string}]

		// })
		// console.log(map)

		const ids = await db
			.select({
				id: surveyqnsTableV2.questionId
			})
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.surveid, params.surveyId))
			.orderBy(asc(surveyqnsTableV2.updatedAt));

		let current_ix = parseInt(cookies.get('current_ix') ?? '0');
		if (current_ix === 0) {
			// check whether we have a persistent ix
			current_ix = await getpersistentIx(locals.user?.id!, params.surveyId);
		}
		if (data.answer === 'undefined')
			return fail(400, {
				warnings: {
					message: 'Please select an option'
				}
			});
		try {
			// validate
			const { answer } = rateZodSchema.parse(data);
			await db.insert(AnswersTable).values({
				questionId: params.questionId,
				surveid: params.surveyId,
				answer: answer,
				agentId: locals.session?.userId as string
			});
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
		// Dynamic routing with incremental counter

		if (current_ix < ids.length - 1) {
			current_ix++;
			// Set the updated current_ix in the cookie
			cookies.set('current_ix', current_ix.toString(), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 5 // expires after 5 mins
			});
			// update the persistent index
			await updateprogressData(locals.user?.id!, params.surveyId, current_ix);

			redirect(303, `/agent-console/surveys/take/${params.surveyId}/${ids[current_ix].id}`);
		} else {
			// Set the cookie to expire then
			cookies.set('current_ix', '0', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 0 // Expire the cookie immediately
			});
			// clear the persistent index also
			await deleteProgressData(locals.user?.id!, params.surveyId);
			// set the new target since this guy cant do the survey again
			await setTarget(params.surveyId);
			// update points
			await updatesurveyPoints(locals.user?.id!, params.surveyId);
			// set the survey as complete
			await setsurveyComplete(locals.user?.id!, params.surveyId);
			//then redirect
			redirect(303, '/agent-console/surveys/take/complete');
		}
	}
};
