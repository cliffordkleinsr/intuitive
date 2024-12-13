import { asc, eq, sql } from 'drizzle-orm';
import { db } from './index';

import {
	AnswersTable,
	SurveyTable,
	UsersTable,
	clientData,
	clientPackages,
	agentData,
	sessionsTable,
	surveyqnsTableV2,
	type ClientDataInsertSchema,
	type RespondentInsertSchema,
	type surveyQnsSchemaV2,
	type userInsertSchema,
	QuestionOptions,
	type progresType,
	progressTable,
	agentSurveysTable,
	payoutRequests,
	type surveyGenerateSchema
} from './schema';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { Cookies } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const deleteCUser = async (userid: string, surveyid: string) => {
	await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, surveyid));
	await db.delete(SurveyTable).where(eq(SurveyTable.clientid, userid));
	await db.delete(clientData).where(eq(clientData.clientId, userid));
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userid));
	await db.delete(UsersTable).where(eq(UsersTable.id, userid));
};
export const deleteAUser = async (userid: string) => {
	await db.delete(agentData).where(eq(agentData.agentid, userid));
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userid));
	await db.delete(UsersTable).where(eq(UsersTable.id, userid));
};
export const getCountAgents = async (variable: PgColumn, userId: string) => {
	const queryResult = await db
		.select({
			variable,
			agent_cnt: sql<number>`cast(count(distinct(${agentData.agentid})) as int)`
		})
		.from(agentData)
		.leftJoin(AnswersTable, eq(agentData.agentid, AnswersTable.agentId))
		.leftJoin(SurveyTable, eq(AnswersTable.surveid, SurveyTable.surveyid))
		.where(sql`${SurveyTable.clientid} = ${userId}`)
		.groupBy(variable);

	return queryResult;
};

export const checkIfEmailExists = async (email: string) => {
	const queryResult = await db
		.select({
			email: UsersTable.email
		})
		.from(UsersTable)
		.where(eq(UsersTable.email, email));

	return queryResult.length > 0;
};
export const checkIfPhoneExists = async (phone: string) => {
	const queryResult = await db.select().from(agentData).where(eq(agentData.phone, phone));

	return queryResult.length > 0;
};

export const checkUserRole = async (email: string) => {
	const [queryResult] = await db
		.select({
			email: UsersTable.email,
			role: UsersTable.role
		})
		.from(UsersTable)
		.where(eq(UsersTable.email, email));

	return queryResult;
};

// Insertion for any User
export const insertNewUser = async (user: userInsertSchema) => {
	return await db.insert(UsersTable).values(user);
};
// Insertion for Agent Users
export const insertRespData = async (data: RespondentInsertSchema) => {
	return await db.insert(agentData).values(data);
};
// Insertion for Client Users
export const insertClientData = async (data: ClientDataInsertSchema) => {
	return await db.insert(clientData).values(data);
};
// Insertion for New Survey
export const createNewSurvey = async (data: surveyGenerateSchema) => {
	return await db.insert(SurveyTable).values(data);
};

export const addSurveyQuestionsv2 = async (data: surveyQnsSchemaV2) => {
	await db.insert(surveyqnsTableV2).values(data);
};

export const deleteSurvey = async (surveyid: string) => {
	await db.delete(agentSurveysTable).where(eq(agentSurveysTable.surveyid, surveyid));
	await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, surveyid));
	await db.delete(SurveyTable).where(eq(SurveyTable.surveyid, surveyid));
};

// =========================== Client Package Utilities ==========================

/**
 * returns the expiry date & the package itself
 * @param id
 * @returns
 */
export const retExpiryDate = async (id: string) => {
	const [expiry_date] = await db
		.select({
			expiry: sql<Date>`${clientData.expires_at}`,
			packagetype: sql<string>`${clientPackages.packageDesc}`
		})
		.from(clientData)
		.leftJoin(clientPackages, eq(clientData.packageid, clientPackages.packageid))
		.where(eq(clientData.clientId, id));
	return expiry_date;
};

/**
 * Checks whether a surveys to date has reached and closes the survey
 * @param id
 * @param fromdb
 * @returns
 */
export const checkDate = async (id: string, fromdb: Date, userid: string) => {
	const diff = new Date().getTime() - fromdb.getTime();
	if (diff > 0) {
		await db
			.update(SurveyTable)
			.set({
				status: 'Closed'
			})
			.where(sql`${SurveyTable.surveyid} = ${id} and ${SurveyTable.clientid} = ${userid}`);
		return {
			message: `Survey ${id} has been closed`
		};
	}
};

/**
 * Utility to get all features to a package that a client has subscribed to
 * @param id
 * @returns
 */
export const getpackageFeatures = async (id: string) => {
	const [feats] = await db
		.select({
			gender_active: clientPackages.demographics,
			ages: clientPackages.ages,
			maxqns: clientPackages.max_questions,
			maxagents: clientPackages.max_agents,
			maxsurv: clientPackages.max_surv,
			plan: clientPackages.package_price_mn
		})
		.from(clientPackages)
		.leftJoin(clientData, eq(clientData.packageid, clientPackages.packageid))
		.where(eq(clientData.clientId, id));

	return feats;
};
/**
 * Utility to analyze whether client package has expired
 * @param id
 * @returns
 */
export const setpackageExpired = async (
	id: string,
	expiry_date: { expiry: Date; packagetype: string }
) => {
	if (expiry_date) {
		const doe = new Date(expiry_date.expiry);
		const diff = new Date().getTime() - doe.getTime();
		if (diff > 0) {
			await db
				.update(clientData)
				.set({
					packageid: null,
					typeid: null,
					payment_status: false,
					expires_at: null
				})
				.where(eq(clientData.clientId, id));
			return {
				message: `Your subscription for the ${expiry_date.packagetype} plan has expired. Renew your plan`
			};
		}
	}
};
/**
 * Utiliy that gets the list of questions from the surveyquestionsV2 table
 * @param surveid
 * @returns
 */
export const questionCount = async (surveid: string) => {
	return await db
		.select({
			id: surveyqnsTableV2.questionId
		})
		.from(surveyqnsTableV2)
		.where(eq(surveyqnsTableV2.surveid, surveid))
		.orderBy(asc(surveyqnsTableV2.updatedAt));
};

//=========================== Agent Progress Utilities ======================================

/** Utility to insert data into the progressTable
 *
 * @param data
 * @returns
 */
export const insertprogressData = async (data: progresType) => {
	return await db.insert(progressTable).values(data);
};

/**
 *  Utility to update the index data in the progressTable
 * @param user
 * @param surveyid
 * @param index
 * @returns
 */
export const updateprogressData = async (user: string, surveyid: string, index: number) => {
	return await db
		.update(progressTable)
		.set({
			current_ix: index
		})
		.where(
			sql`${progressTable.agentid} = ${user}
            and 
            ${progressTable.surveyid} = ${surveyid}`
		);
};
/**
 * Utility for selecting data from the progress table.
 * It takes in two parameters :
 * @param {string} user
 * @param {string} surveyid
 * @returns {Array} query
 */
export const selectProgressData = async (user: string, surveyid: string) => {
	return await db
		.select()
		.from(progressTable)
		.where(
			sql`${progressTable.agentid} = ${user}
            and 
            ${progressTable.surveyid} = ${surveyid}`
		);
};

/**
 * Utility for deleting data from the progress table.
 * @param user
 * @param surveyid
 * @returns
 */
export const deleteProgressData = async (user: string, surveyid: string) => {
	return await db.delete(progressTable).where(
		sql`${progressTable.agentid} = ${user}
            and 
            ${progressTable.surveyid} = ${surveyid}`
	);
};

//  When answering qns we want to:
// 1). get the list of all the questions we are answering
// reduce the target when we are answering the last question
// 2). Analyze whether we have a stored index in persistent storage
//

/**
 * Get a list of all the questions we are answering
 * @param questionId
 * @returns {Array}
 */
export const getsurveyQuestions = async (questionId: string) => {
	return await db
		.select({
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			likert_key: sql<string>`${surveyqnsTableV2.likertKey}`,
			optionid: sql<string[]>`ARRAY_AGG(${QuestionOptions.optionId})`,
			options: sql<string[]>`ARRAY_AGG(${QuestionOptions.option})`
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.questionId, questionId))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.updatedAt));
};
/**
 * Analyzes whether we have a stored index in persistent storage
 * @param user
 * @param surveyid
 * @returns
 */
export const getpersistentIx = async (user: string, surveyid: string) => {
	let persisted_ix: number = 0;
	const [persistent] = await db
		.select({ ix: progressTable.current_ix })
		.from(progressTable)
		.where(
			sql`${progressTable.agentid} = ${user}
             and 
             ${progressTable.surveyid} = ${surveyid}`
		);
	if (persistent) {
		persisted_ix = persistent.ix;
	}
	return persisted_ix;
};

/**
 * Updates the target once the survey has been completed
 * @param id
 */
export const setTarget = async (id: string): Promise<void> => {
	try {
		const curr_tgt = await db
			.select({
				target: SurveyTable.target
			})
			.from(SurveyTable)
			.where(eq(SurveyTable.surveyid, id));

		const currTarget = curr_tgt[0].target!;
		if (currTarget === undefined) {
			throw new Error('Target not found');
		}

		const new_tgt = currTarget - 1;

		await db
			.update(SurveyTable)
			.set({
				target: new_tgt
			})
			.where(eq(SurveyTable.surveyid, id));
	} catch (error) {
		console.error('Error updating target:', error);
	}
};

/**
 * Utility to complete the survey
 * @param user
 * @param surveyid
 * @returns
 */
export const setsurveyComplete = async (user: string, surveyid: string) => {
	return await db
		.update(agentSurveysTable)
		.set({
			survey_completed: true
		})
		.where(
			sql`${agentSurveysTable.agentid} = ${user}
             and 
             ${agentSurveysTable.surveyid} = ${surveyid}`
		);
};
/**
 * Sets the points after survey completion
 * @param user
 * @param surveyid
 * @returns
 */
export const updatesurveyPoints = async (user: string, surveyid: string) => {
	const [curr_pts] = await db
		.select({
			pts: agentData.total_pts_earned
		})
		.from(agentData)
		.where(eq(agentData.agentid, user));

	const [to_add] = await db
		.select({
			pts: agentSurveysTable.points
		})
		.from(agentSurveysTable)
		.where(
			sql`${agentSurveysTable.agentid} = ${user}
             and 
             ${agentSurveysTable.surveyid} = ${surveyid}`
		);
	const aggregate = curr_pts.pts + to_add.pts;

	return await db
		.update(agentData)
		.set({
			total_pts_earned: aggregate,
			total_points_payable: aggregate
		})
		.where(eq(agentData.agentid, user));
};

/**
 * Util to reset all the amounts and rate limits in dev mode
 * @param userid
 * @param limiter
 * @returns
 */
export const paymentRequestreset = async (userid: string) => {
	return await Promise.all([
		db
			.update(agentData)
			.set({
				total_points_payable: 2000
			})
			.where(eq(agentData.agentid, userid)),

		db.delete(payoutRequests)
	]);
};

export const countAgents = async (complete: boolean, survid: string) => {
	const query = await db
		.select({
			id: agentSurveysTable.agentid
		})
		.from(agentSurveysTable)
		.where(
			sql`${agentSurveysTable.survey_completed} = ${complete} and ${agentSurveysTable.surveyid} = ${survid}`
		);
	return query.length;
};
export const countFltAgents = async (gender: string, complete: boolean, survid: string) => {
	const query = await db
		.select({
			id: agentSurveysTable.agentid
		})
		.from(agentSurveysTable)
		.leftJoin(UsersTable, eq(agentSurveysTable.agentid, UsersTable.id)).where(sql`
        ${agentSurveysTable.survey_completed} = ${complete}
         and ${agentSurveysTable.surveyid} = ${survid}
         and ${UsersTable.gender} = ${gender}
         `);
	return query.length;
};

export const countTotAgents = async (survid: string) => {
	const query = await db
		.select({
			id: agentSurveysTable.agentid
		})
		.from(agentSurveysTable)
		.where(sql`${agentSurveysTable.surveyid} = ${survid}`);
	return query.length;
};

/**
 *
 * @param gender
 * @param userId
 * @param surveyid
 * @returns
 */
export const getAnswers = async (gender: string = '', userId: string, surveyid: string) => {
	return await db
		.select({
			question_id: surveyqnsTableV2.questionId,
			question_type: surveyqnsTableV2.questionT,
			question: surveyqnsTableV2.question,
			answer: AnswersTable.answer,
			count: sql<number>`COUNT(*)`,
			percentage: sql<number>`(COUNT(*) * 100.0) / (
        SELECT COUNT(*) 
        FROM ${AnswersTable}
        WHERE ${AnswersTable.questionId} = ${surveyqnsTableV2.questionId}
      )`
		})
		.from(surveyqnsTableV2)
		.innerJoin(AnswersTable, eq(surveyqnsTableV2.questionId, AnswersTable.questionId))
		.leftJoin(SurveyTable, eq(surveyqnsTableV2.surveid, SurveyTable.surveyid))
		.leftJoin(UsersTable, sql`${AnswersTable.agentId} =  ${UsersTable.id}`) // Join with UsersTable
		.where(
			sql`
        ${SurveyTable.clientid} = ${userId} 
        and ${SurveyTable.surveyid} = ${surveyid} 
        and ${UsersTable.gender} = ${gender}`
		)
		.groupBy(
			surveyqnsTableV2.questionId,
			surveyqnsTableV2.questionT,
			surveyqnsTableV2.question,
			AnswersTable.answer,
			UsersTable.gender
		);
};

/**
 *
 * @param gender
 * @param surveyid
 * @returns
 */
export const getCounties = async (gender: string = '', surveyid: string) => {
	return await db
		.select({
			loc_dem: sql<string>`UPPER(${agentData.county})`,
			agents: sql<number>`COUNT(DISTINCT(${agentData.agentid}))`
		})
		.from(agentData)
		.leftJoin(agentSurveysTable, sql`${agentData.agentid} = ${agentSurveysTable.agentid}`)
		.rightJoin(UsersTable, eq(agentData.agentid, UsersTable.id))
		.where(
			sql`${agentSurveysTable.surveyid} = ${surveyid} 
        and ${agentSurveysTable.survey_completed} = TRUE
        and ${UsersTable.gender} = ${gender}
        `
		)
		.groupBy(agentData.county);
};

/**
 *
 * @param gender
 * @param surveyid
 */
export const getGender = async (gender: string = '', surveyid: string) => {
	return await db
		.select({
			gen_dem: sql<string>`UPPER(${UsersTable.gender})`,
			agents: sql<number>`COUNT(DISTINCT(${UsersTable.id}))`
		})
		.from(UsersTable)
		.leftJoin(agentSurveysTable, sql`${UsersTable.id} = ${agentSurveysTable.agentid}`)
		.where(
			sql`${agentSurveysTable.surveyid} = ${surveyid} 
        and ${agentSurveysTable.survey_completed} = TRUE
        and ${UsersTable.gender} = ${gender}
        `
		)
		.groupBy(UsersTable.gender);
};

/**
 *
 * @param gender
 * @param surveyid
 * @returns
 */
export const getSector = async (gender: string, surveyid: string) => {
	return await db
		.select({
			sec_dem: sql<string>`SPLIT_PART(${agentData.sector}, '-', 2)`,
			agents: sql<number>`COUNT(DISTINCT(${agentData.agentid}))`
		})
		.from(agentData)
		.leftJoin(UsersTable, sql`${UsersTable.id} = ${agentData.agentid}`)
		.leftJoin(agentSurveysTable, sql`${agentData.agentid} = ${agentSurveysTable.agentid}`)
		.where(
			sql`
        ${agentSurveysTable.surveyid} = ${surveyid}
        and ${agentSurveysTable.survey_completed} = TRUE
        and ${UsersTable.gender} = ${gender}
        `
		)
		.groupBy(agentData.sector);
};

export const countTotFltrdAgents = async (gender: string, survid: string) => {
	const query = await db
		.select({
			id: agentSurveysTable.agentid
		})
		.from(agentSurveysTable)
		.leftJoin(UsersTable, eq(agentSurveysTable.agentid, UsersTable.id)).where(sql`
        ${agentSurveysTable.surveyid} = ${survid}
        and ${UsersTable.gender} = ${gender}
        `);
	return query.length;
};

export const indexParser = (index: number, cookies: Cookies): void => {
	cookies.set('current_ix', String(index), {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 5 // expires after 5 mins
	});
};

export const indexReset = (cookies: Cookies): void => {
	cookies.set('current_ix', '0', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 0 // Expire the cookie immediately
	});
};

/**
 *  Redirects with condition
 * @param uid string
 * @param surveid string
 * @param cookies Cookies
 */
export async function handleSurveyProgress({
	uid,
	surveyId,
	cookies
}: {
	uid: string;
	surveyId: string;
	cookies: Cookies;
}) {
	// Get current progress and total questions
	const [db_ix, ids] = await Promise.all([getpersistentIx(uid, surveyId), questionCount(surveyId)]);

	// Get current index from cookies or database
	let current_ix = parseInt(cookies.get('current_ix') ?? '0') || db_ix;

	// Increment if not at the end
	if (current_ix < ids.length - 1) {
		current_ix++;
		indexParser(current_ix, cookies);
		// Get next question ID
		const next = ids[current_ix].id;

		// Update progress in database
		await updateprogressData(uid, surveyId, current_ix);

		// Redirect to next question
		redirect(
			303,
			`/agent-console/surveys/take/${surveyId}/${next}`,
			{ type: 'success', message: 'Input Successfully Recorded' },
			cookies
		);
	} else {
		// clear client cookie
		indexReset(cookies);
		// clear the persistent index also
		await deleteProgressData(uid, surveyId);
		// set the new target since this guy cant do the survey again
		// await setTarget(surveyId);
		// update points
		await updatesurveyPoints(uid, surveyId);
		// set the survey as complete
		await setsurveyComplete(uid, surveyId);
		//then redirect
		redirect(303, '/agent-console/surveys/take/complete');
	}
}

/**
 *  Redirects with condition
 * @param uid string
 * @param surveid string
 * @param cookies Cookies
 */
export async function handleSurveyProgressExt({
	surveyId,
	cookies
}: {
	surveyId: string;
	cookies: Cookies;
}) {
	// Get current progress and total questions
	const ids = await questionCount(surveyId);

	// Get current index from cookies or database
	let current_ix = parseInt(cookies.get('current_ix') ?? '0');

	// Increment if not at the end
	if (current_ix < ids.length - 1) {
		current_ix++;
		indexParser(current_ix, cookies);
		// Get next question ID
		const next = ids[current_ix].id;

		// Update progress in database

		// Redirect to next question
		redirect(
			303,
			`/anonymous/${surveyId}/${next}`,
			{ type: 'success', message: 'Input Successfully Recorded' },
			cookies
		);
	} else {
		// clear client cookie
		indexReset(cookies);
		//then redirect
		redirect(303, '/anonymous/complete');
	}
}

export async function validateAnswerNotExists(
	questionid: string,
	cookies: Cookies,
	agentId: string
) {
	const exists = await db
		.select()
		.from(AnswersTable)
		.where(
			sql`
				${AnswersTable.questionId} = ${questionid}
				and
				${AnswersTable.agentId} = ${agentId}
			`
		);
	if (exists.length > 0) {
		redirect(
			303,
			'/agent-console/surveys/take',
			{ type: 'error', message: 'Not Allowed' },
			cookies
		);
	}
}
// await db.insert(clientPackages).values({
//     packageid: 'prod_QTgA9EH6qo3dRu',
//     packageDesc: 'Premium Business',
//     package_price_mn: '2000',
//     package_price_yr: '21600',
//     demographics: true,
//     ages: true,
//     max_agents: 500,
//     max_questions: 30,
//     max_surv:6,
//     priceIdMn: 'price_1PcioZRpYHoLk6LShwTOi7Zc',
//     priceIdYr: 'price_1PcioZRpYHoLk6LSAOiDsuSs'
// })
// await Promise.all([
//     db.insert(clientPackages).values({
//         packageid: 'prod_QjUCV2u3waC96D',
//         packageDesc: 'One-time',
//         package_price_mn: '30',
//         package_price_yr: '30',
//         demographics: true,
//         ages: true,
//         max_agents: 100,
//         max_questions: 5,
//         max_surv:1,
//         priceIdMn: 'price_1Ps1ELRpYHoLk6LSjizQbL8q',
//         priceIdYr: 'price_1Ps1ELRpYHoLk6LSjizQbL8q'
//     }),
//     db.insert(clientPackages).values({
//         packageid: 'prod_QjUMG44vCFNGXO',
//         packageDesc: 'Basic',
//         package_price_mn: '50',
//         package_price_yr: '540',
//         demographics: true,
//         ages: true,
//         max_agents: 100,
//         max_questions: 5,
//         max_surv:2,
//         priceIdMn: 'price_1Ps1ODRpYHoLk6LSg56V1no0',
//         priceIdYr: 'price_1Ps1ODRpYHoLk6LSMN8kgMJf'
//     }),
//     db.insert(clientPackages).values({
//         packageid: 'prod_QTg6aK5zM7RlUw',
//         packageDesc: 'Standard Business',
//         package_price_mn: '200',
//         package_price_yr: '2160',
//         demographics: true,
//         ages: true,
//         max_agents: 250,
//         max_questions: 15,
//         max_surv:4,
//         priceIdMn: 'price_1PcikKRpYHoLk6LSwn6RloI0',
//         priceIdYr: 'price_1PcikKRpYHoLk6LSiWl3cO16'
//     }),
//     db.insert(clientPackages).values({
//         packageid: 'prod_QTgA9EH6qo3dRu',
//         packageDesc: 'Premium Business',
//         package_price_mn: '1200',
//         package_price_yr: '12960',
//         demographics: true,
//         ages: true,
//         max_agents: 500,
//         max_questions: 30,
//         max_surv:6,
//         priceIdMn: 'price_1PcioZRpYHoLk6LShwTOi7Zc',
//         priceIdYr: 'price_1PcioZRpYHoLk6LSAOiDsuSs'
//     }),
// ])
// await db.delete(smsVerification).where(eq(smsVerification.userId, 'vsz9hei4m2dnr18'))
// await db.delete(agentData).where(eq(agentData.agentid, 'vsz9hei4m2dnr18'))
// await db.delete(UsersTable).where(eq(UsersTable.id, 'vsz9hei4m2dnr18'))
// await db.delete(emailVerification).where(
//     eq(emailVerification.userId, 'vsz9hei4m2dnr18')
// )
// await db.delete(clientData).where(
//     eq(clientData.clientId, 'vsz9hei4m2dnr18')
// )
// await db.delete(UsersTable).where(
//     eq(UsersTable.id, 'vsz9hei4m2dnr18')
// )
// let date = new Date(); // Now
// let next = date.setDate(date.getDate() + 30)
// await db.update(clientData).set({
// 	packageid:'prod_QTgA9EH6qo3dRu',
// 	typeid:'price_1Ps1UARpYHoLk6LSTei2ionx',
// 	payment_status:true,
// 	processed_at: new Date(),
// 	expires_at: new Date(next)
// }).where(eq(clientData.clientId, 'c1bde176-582a-4028-888e-a70875a11f51'))
