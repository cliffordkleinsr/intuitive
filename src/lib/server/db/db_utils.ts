import { and, asc, eq, gt, inArray, lte, sql } from 'drizzle-orm';
import { db } from './index';

import {
	AnswersTable,
	UsersTable,
	agentData,
	sessionsTable,
	surveyqnsTableV2,
	type RespondentInsertSchema,
	type surveyQnsSchemaV2,
	type userInsertSchema,
	QuestionOptions,
	type progresType,
	progressTable,
	agentSurveysTable,
	payoutRequests,
	type surveyGenerateSchema,
	// branchingRules,
	pricingTable,
	consumerDeats,
	consumerPackage,
	type ConsumerData,
	SurveyTable,
	QuestionBranching
} from './schema';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { Cookies } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { Question } from '$lib/types';
import { toast } from 'svelte-sonner';

type ClientDataInsertSchema = any;
let clientData: any = {};
let clientPackages: any = {};
/**
 * @deprecated No longer Needed
 * @param userid
 * @param surveyid
 */
export const deleteCUser = async (userid: string, surveyid: string) => {
	await db.delete(surveyqnsTableV2).where(eq(surveyqnsTableV2.surveid, surveyid));
	await db.delete(SurveyTable).where(eq(SurveyTable.clientid, userid));
	await db.delete(clientData).where(eq(clientData.clientId, userid));
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userid));
	await db.delete(UsersTable).where(eq(UsersTable.id, userid));
};

export function returnDateValue(type: string, plan: string) {
	let date_val =
		type === 'advanced' || type === 'advantage' ? 365 : plan !== 'Enterprise' ? 30 : 90;
	return date_val;
}
/**
 * @deprecated No longer Needed
 * @param userid
 */
export const deleteAUser = async (userid: string) => {
	await db.delete(agentData).where(eq(agentData.agentid, userid));
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userid));
	await db.delete(UsersTable).where(eq(UsersTable.id, userid));
};

export const getconsumerDetails = async (userid: string) => {
	const [consumer] = await db
		.select({
			businessName: consumerDeats.company_name,
			businessAddressLine1: consumerDeats.phone,
			invoiceNumber: consumerPackage.id,
			invoiceDate: sql<Date>`${consumerPackage.invoiced}::date`,
			expiryDates: sql<Date>`${consumerPackage.expires}::date`
		})
		.from(consumerDeats)
		.leftJoin(consumerPackage, eq(consumerPackage.consumerid, consumerDeats.consumerid))
		.where(eq(consumerDeats.consumerid, userid));
	return consumer;
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
		.where(sql`${SurveyTable.consumer_id} = ${userId}`)
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

export const createGoogleUser = async (googleUserId: string, username: string, picture: string) => {
	return await db
		.insert(UsersTable)
		.values({
			id: crypto.randomUUID(),
			googleId: googleUserId,
			fullname: username,
			pfp: picture,
			role: 'CLIENT',
			update_registry: true
		})
		.returning({ id: UsersTable.id });
};

export const getRegistryState = async (id: string): Promise<Boolean | null> => {
	if (id) {
		const [registry] = await db
			.select({
				state: UsersTable.update_registry
			})
			.from(UsersTable)
			.where(eq(UsersTable.id, id));

		return registry?.state;
	}
	return null;
};
export const getEmailUser = async (email: string) => {
	const [user] = await db
		.select({
			id: UsersTable.id,
			password: UsersTable.password,
			role: UsersTable.role,
			verified: UsersTable.isEmailVerified
		})
		.from(UsersTable)
		.where(eq(UsersTable.email, email));
	return user;
};
export const getUserFromGoogleId = async (googleUserId: string) => {
	const [user] = await db.select().from(UsersTable).where(eq(UsersTable.googleId, googleUserId));
	return user;
};
// Insertion for any User
export const insertNewUser = async (user: userInsertSchema) => {
	return await db.insert(UsersTable).values(user);
};
// Insertion for Agent Users
export const insertRespData = async (data: RespondentInsertSchema) => {
	return await db.insert(agentData).values(data);
};
// Insertion for Old Client Users
/**Method to insert client data
 * @deprecated use insertConsumerData instead
 * @param data
 * @returns
 */
export const insertClientData = async (data: ClientDataInsertSchema) => {
	return await db.insert(clientData).values(data);
};

/**
 * Method to insert ConsumerData
 * @param data
 * @returns
 */
export const insertConsumerData = async (data: ConsumerData) => {
	return await db.insert(consumerDeats).values(data);
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

// =========================== Old Client Package Utilities ==========================

export const checkOnetime = async (id: string) => {
	const [onetime] = await db
		.select({
			state: clientData.onetime
		})
		.from(clientData)
		.where(eq(clientData.clientId, id));
	return onetime;
};
export const getOldPaymentStatus = async (id: string) => {
	const [payment] = await db
		.select({
			status: clientData.payment_status
		})
		.from(clientData)
		.where(eq(clientData.clientId, id));

	return payment as { status: boolean };
};

/**
 * returns the expiry date & the package itself
 * @param id
 * @returns
 */
const retExpiryDate = async (id: string) => {
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
 * Checks whether a surveys expiry date has reached and closes the survey
 * @deprecated for old surveys
 * @param id
 * @param fromdb
 * @returns
 */
export const disableOldSurvey = async (id: string) => {
	const live = await db
		.select({
			surveyid: SurveyTable.surveyid,
			expiry_date: SurveyTable.to
		})
		.from(SurveyTable)
		.where(sql`${SurveyTable.status} = 'Live' and ${SurveyTable.clientid} = ${id}`);
	for (const { surveyid, expiry_date } of live) {
		const diff = new Date().getTime() - expiry_date!.getTime();
		if (diff > 0) {
			await db
				.update(SurveyTable)
				.set({
					status: 'Closed'
				})
				.where(sql`${SurveyTable.surveyid} = ${surveyid} and ${SurveyTable.clientid} = ${id}`);
			toast.warning(`Survey ${surveyid} has been closed`);
		}
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

			toast.warning(
				`Your subscription for the ${expiry_date.packagetype} plan has expired. Renew your plan`
			);
		}
	}
};
/**
 *complemenary to the above
 * @param id
 */
export const expirePackage = async (id: string) => {
	const features = await getpackageFeatures(id);
	if (typeof features === 'object') {
		if (typeof features.plan === 'string') {
			const expiry_date = await retExpiryDate(id);
			const { expiry } = expiry_date;
			// to disable plans that have expired
			if (new Date(expiry) < new Date()) {
				const expired = await setpackageExpired(id, expiry_date);
			}
		}
	}
};

// ============================= New Client Utilities ======================================

/**
 * Same as above but for the new pricing
 * @param id
 * @returns
 */
export const doPriceLookup = async (id: string) => {
	const [on_demand_pkg] = await db
		.select({
			plan: pricingTable.title,
			type: consumerPackage.package_type,
			max_questions: pricingTable.max_qns,
			max_responses: pricingTable.max_responses,
			demographics: pricingTable.demographics,
			api: pricingTable.api,
			branding: pricingTable.branding
		})
		.from(pricingTable)
		.leftJoin(consumerPackage, eq(consumerPackage.package_id, pricingTable.id))
		.where(eq(consumerPackage.consumerid, id));
	return on_demand_pkg;
};
export const getNewPaymentStatus = async (id: string) => {
	const current_scope =
		(
			await db
				.select()
				.from(consumerPackage)
				.where(
					sql`
						${consumerPackage.consumerid} = ${id}
						and
						(${consumerPackage.expires} - NOW()) < interval '30' day
					`
				)
		).length > 0;
	return current_scope;
};

export const retSurveyInfo = async (id: string) => {
	const select = {
		id: SurveyTable.surveyid,
		title: SurveyTable.title,
		expires: sql<Date>`${SurveyTable.survey_expires}::timestamp::date`,
		status: SurveyTable.status
	};
	const [allsurveys, draftsurveys, livesurveys, closedsurveys] = await Promise.all([
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.consumer_id} = ${id}`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.consumer_id} = ${id} and ${SurveyTable.status} = 'Draft'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.consumer_id} = ${id} and ${SurveyTable.status} = 'Live'`),
		db
			.select(select)
			.from(SurveyTable)
			.where(sql`${SurveyTable.consumer_id} = ${id} and ${SurveyTable.status} = 'Closed'`)
	]);

	return [allsurveys, draftsurveys, livesurveys, closedsurveys];
};

export const disableSurvey = async (id: string) => {
	const live = await db
		.select({
			surveyid: SurveyTable.surveyid,
			expiry_date: SurveyTable.survey_expires
		})
		.from(SurveyTable)
		.where(sql`${SurveyTable.status} = 'Live' and ${SurveyTable.consumer_id} = ${id}`);
	for (const { surveyid, expiry_date } of live) {
		const diff = new Date().getTime() - expiry_date!.getTime();
		if (diff > 0) {
			await db
				.update(SurveyTable)
				.set({
					status: 'Closed'
				})
				.where(sql`${SurveyTable.surveyid} = ${surveyid} and ${SurveyTable.consumer_id} = ${id}`);
			toast.warning(`Survey ${surveyid} has been closed`);
		}
	}
};
// needs work
// sql`${SurveyTable.status} = 'Live' and ${SurveyTable.clientid} = ${id}`
// for (const {surveyid, expiry_date} of live) {
// 	const diff = new Date().getTime() - expiry_date!.getTime();
// 	if (diff > 0) {
// 		await db
// 			.update(SurveyTable)
// 			.set({
// 				status: 'Closed'
// 			})
// 			.where(sql`${SurveyTable.surveyid} = ${surveyid} and ${SurveyTable.clientid} = ${id}`);
// 		toast.warning(`Survey ${surveyid} has been closed`)
// 	}
// }
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
 * Gets the list of questions from the survey
 * @param surveyid
 * @returns {Promise<Array<Object>>}
 */
export const getsurveyQuestions = async (surveyid: string) => {
	const questions = await db
		.select({
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			likert_key: sql<string>`${surveyqnsTableV2.likertKey}`,
			optionid: sql<
				string[]
			>`ARRAY_AGG(${QuestionOptions.optionId} ORDER BY ${QuestionOptions.order_index})`,
			options: sql<
				string[]
			>`ARRAY_AGG(${QuestionOptions.option} ORDER BY ${QuestionOptions.order_index})`,
			created_at: surveyqnsTableV2.createdAt
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.surveid, surveyid))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.createdAt));

	return questions;
};

export async function getBranches(surveyid: string) {
	const branches = await db
		.select()
		.from(QuestionBranching)
		.where(eq(QuestionBranching.surveid, surveyid));

	return branches;
}
// Helper to order questions based on branching
interface Questions {
	id: string;
	question: string;
	question_type: string;
	likert_key: string;
	optionid: string[];
	options: string[];
	created_at: Date;
}
interface Branches {
	questionId: string;
	surveid: string;
	optionId: string;
	branchId: string;
	nextQuestionId: string;
}
export function orderQuestions(questions: Questions[], branches: Branches[]): Questions[] {
	// Map each question ID to its question data
	const questionMap = new Map(questions.map((q) => [q.id, q]));

	// Build a mapping: questionId -> array of nextQuestionIds
	const branchMap = new Map<string, string[]>();
	branches.forEach((branch) => {
		const list = branchMap.get(branch.questionId) || [];
		list.push(branch.nextQuestionId);
		branchMap.set(branch.questionId, list);
	});

	// Identify root questions:
	// A question is considered "root" if it is never referenced as a nextQuestionId in any branch.
	const referenced = new Set(branches.map((b) => b.nextQuestionId));
	const roots = questions.filter((q) => !referenced.has(q.id));

	const ordered: any[] = [];
	const visited = new Set<string>();

	// Depth-first search to traverse the branch tree
	function traverse(questionId: string) {
		if (visited.has(questionId)) return;
		visited.add(questionId);

		const question = questionMap.get(questionId);
		if (question) {
			ordered.push(question);
		}
		const children = branchMap.get(questionId) || [];
		// For consistent order, you might sort children by created_at or another field if needed
		children.forEach((childId) => traverse(childId));
	}

	// Start traversal from each root
	roots.forEach((root) => traverse(root.id));

	// In case some questions were not reached (e.g., disconnected parts), append them
	questions.forEach((q) => {
		if (!visited.has(q.id)) {
			ordered.push(q);
		}
	});

	return ordered;
}

/**
 * Get the question attributes by id
 * @param questionId
 * @returns {Promise<Array<Object>>}
 */
export const getsurveyQuestionByID = async (questionId: string) => {
	const questions = await db
		.select({
			id: surveyqnsTableV2.questionId,
			question: surveyqnsTableV2.question,
			question_type: surveyqnsTableV2.questionT,
			likert_key: sql<string>`${surveyqnsTableV2.likertKey}`,
			optionid: sql<string[]>`ARRAY_AGG(${QuestionOptions.optionId})`,
			options: sql<string[]>`ARRAY_AGG(${QuestionOptions.option})`,
			created_at: surveyqnsTableV2.createdAt
		})
		.from(surveyqnsTableV2)
		.leftJoin(QuestionOptions, eq(surveyqnsTableV2.questionId, QuestionOptions.questionId))
		.where(eq(surveyqnsTableV2.questionId, questionId))
		.groupBy(surveyqnsTableV2.questionId, surveyqnsTableV2.question)
		.orderBy(asc(surveyqnsTableV2.updatedAt));
	return questions;
};

export function generateFlow(questions: Questions[], branches: Branches[]) {
	const orderedQuestions = orderQuestions(questions, branches);

	const nodes: any[] = [];
	const edges: any[] = [];
	const positionMap = new Map<string, any>();

	const xSpacing = 400;
	const ySpacing = 120;
	let x = 0,
		y = 0;

	// Map of question IDs to children (from branches)
	const childrenMap = new Map<string, string[]>();
	branches.forEach(({ questionId, nextQuestionId }) => {
		if (!childrenMap.has(questionId)) {
			childrenMap.set(questionId, []);
		}
		childrenMap.get(questionId)!.push(nextQuestionId);
	});

	const visited = new Set<string>();

	function placeNode(questionId: string, x: number, y: number) {
		if (visited.has(questionId)) return;
		visited.add(questionId);

		const question = orderedQuestions.find((q) => q.id === questionId);
		if (!question) return;

		// Store position
		positionMap.set(questionId, { x, y });

		// Create the node
		nodes.push({
			id: questionId,
			type: 'default',
			data: { label: question.question },
			position: { x, y }
		});

		// Get children (if any branches exist)
		const children = childrenMap.get(questionId) || [];

		if (children.length) {
			let startX = x - ((children.length - 1) * xSpacing) / 2;

			children.forEach((childId, index) => {
				edges.push({
					id: `${questionId}-${childId}`,
					source: questionId,
					target: childId,
					animated: true
				});

				// Recursive placement for branch children
				placeNode(childId, startX + index * xSpacing, y + ySpacing);
			});
		} else {
			// If no branch, link to the next question in order
			const nextIndex = orderedQuestions.findIndex((q) => q.id === questionId) + 1;
			if (nextIndex < orderedQuestions.length) {
				const nextQuestion = orderedQuestions[nextIndex];
				edges.push({
					id: `${questionId}-${nextQuestion.id}`,
					source: questionId,
					target: nextQuestion.id
				});

				placeNode(nextQuestion.id, x, y + ySpacing);
			}
		}
	}

	// Start placing nodes from the first ordered question
	if (orderedQuestions.length) {
		placeNode(orderedQuestions[0].id, x, y);
	}

	return { nodes, edges };
}

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
 * @deprecated dont use
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
        ${SurveyTable.consumer_id} = ${userId} 
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

// Function to get next question based on current answer
export async function getNextQuestion(
	currentQuestionId: string,
	selectedOptionId: string | null,
	surveyid: string,
	currentat: Date
): Promise<any | null> {
	// If no option selected, get next question by updated_at
	if (!selectedOptionId) {
		const [next] = await db
			.select()
			.from(surveyqnsTableV2)
			.where(
				and(eq(surveyqnsTableV2.surveid, surveyid), gt(surveyqnsTableV2.updatedAt, currentat))
			);
		return next;
	}

	// Check if there's a branching rule for this option
	const [branchingRule] = await db
		.select()
		.from(branchingRules)
		.where(
			and(
				eq(branchingRules.questionId, currentQuestionId),
				eq(branchingRules.selectedOptionId, selectedOptionId)
			)
		);

	if (branchingRule) {
		const [braqn] = await db
			.select()
			.from(surveyqnsTableV2)
			.where(eq(surveyqnsTableV2.questionId, branchingRule.nextQuestionId));
		return braqn;
	}

	// If no branching rule, fall back to next question by updated_at
	const [neqns] = await db
		.select()
		.from(surveyqnsTableV2)
		.where(
			and(eq(surveyqnsTableV2.questionId, surveyid), gt(surveyqnsTableV2.updatedAt, currentat))
		);
	return neqns;
}

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
