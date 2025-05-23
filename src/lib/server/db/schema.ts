import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	boolean,
	pgEnum,
	uuid,
	doublePrecision
} from 'drizzle-orm/pg-core';
// refs
export const UserRole = pgEnum('UserRole', ['ADMIN', 'CLIENT', 'AGENT']);
export const QuestionType = pgEnum('QuestionType', [
	'Single',
	'Optional',
	'Multiple',
	'Ranking',
	'Rating',
	'Likert'
]);
export const Status = pgEnum('status', ['Draft', 'Live', 'Closed']);
export const ProcessedStatus = pgEnum('processed_status', ['pending', 'complete', 'declined']);

// Model USERS
export const UsersTable = pgTable('users', {
	id: text('id').primaryKey(),
	googleId: text(),
	fullname: text('fullname').notNull(),
	email: text('email').unique(),
	isEmailVerified: boolean('is_email_verified').notNull().default(false),
	password: text('password'), //.notNull(),
	role: UserRole('userole').default('AGENT').notNull(),
	age: integer('age'),
	gender: text('gender'),
	pfp: text('profile_pic'),
	update_registry: boolean().default(false).notNull(),
	disabled: boolean('disabled').default(false).notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).defaultNow()
});

export const sessionsTable = pgTable('user_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => UsersTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const agentData = pgTable('agent_data', {
	agentid: text('agent_id')
		.references(() => UsersTable.id)
		.primaryKey()
		.notNull(),
	email: text('agent_email')
		.references(() => UsersTable.email)
		.notNull(),
	phone: text('phone').notNull(),
	dateofbirth: text('dob'), //.notNull(),
	county: text('county'), //.notNull(),
	subcounty: text('subcounty'), //.notNull().default('Starehe'),
	income: text('income'), //.notNull(),
	employment: text('employment'), //.notNull(),
	education: text('education'), //.notNull(),
	sector: text('sector'), //.notNull(),
	// additional
	total_pts_earned: integer('total_pts_earned').notNull().default(0),
	total_pts_paid: integer('total_pts_paid').notNull().default(0),
	total_points_payable: integer('total_points_payable').notNull().default(0),
	external: boolean().default(false).notNull(),
	reset: boolean().default(false).notNull(),
	referall_by: text()
});

// export const clientData = pgTable('client_data', {
// 	clientId: text('client_id')
// 		.references(() => UsersTable.id)
// 		.primaryKey()
// 		.notNull(),
// 	email: text('client_email')
// 		.references(() => UsersTable.email)
// 		.notNull(),
// 	companyName: text('company_name').notNull(),
// 	phone: text('phone').notNull(),
// 	county: text('county').notNull(),
// 	sector: text('sector').notNull(),
// 	//additional
// 	packageid: text('packageid'),
// 	onetime: boolean('one_time').notNull().default(false),
// 	typeid: text('package_type_id'),
// 	payment_status: boolean('payment_status').notNull().default(false),
// 	processed_at: timestamp('processed_at', {
// 		withTimezone: true,
// 		mode: 'date'
// 	}),
// 	expires_at: timestamp('expires_at', {
// 		withTimezone: true,
// 		mode: 'date'
// 	}),
// 	//
// 	createdAt: timestamp('created_at', {
// 		withTimezone: true,
// 		mode: 'date'
// 	})
// 		.defaultNow()
// 		.notNull()
// });

// export const clientPackages = pgTable('client_packages', {
// 	packageid: text('packageid').primaryKey(),
// 	packageDesc: text('package_description').notNull(),
// 	package_price_mn: text('package_price_mn').notNull(),
// 	package_price_yr: text('package_price_yr').notNull(),
// 	priceIdMn: text('price_id_monthly'),
// 	priceIdYr: text('price_id_annual'),
// 	max_questions: integer('max_qns').notNull().default(1),
// 	max_surv: integer('max_surveys').notNull().default(1),
// 	max_agents: integer('max_agents').notNull().default(0),
// 	demographics: boolean('demographics').notNull().default(false),
// 	ages: boolean('ages').notNull().default(false)
// });

export const consumerDeats = pgTable('consumer_details', {
	consumerid: text()
		.references(() => UsersTable.id)
		.primaryKey()
		.notNull(),
	email: text()
		.references(() => UsersTable.email)
		.notNull(),
	company_name: text().notNull(),
	phone: text().notNull(),
	country: text().notNull(),
	state: text().notNull(),
	sector: text().notNull(),
	disabled: boolean().notNull().default(false),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

export const pricingTable = pgTable('price_table', {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	one_pack: text().notNull(),
	six_pack: text().notNull(),
	ten_pack: text().notNull(),
	max_qns: doublePrecision().notNull(),
	max_responses: doublePrecision().notNull(),
	demographics: boolean().notNull().default(false),
	api: boolean().notNull().default(false),
	branding: boolean().notNull().default(false)
});

export const consumerPackage = pgTable('consumer_package', {
	id: serial().notNull().primaryKey(),
	consumerid: text()
		.references(() => UsersTable.id)
		.notNull(),
	package_id: integer()
		.references(() => pricingTable.id)
		.notNull(),
	transaction_code: text().notNull(),
	package: text().notNull(),
	package_type: text().notNull(),
	invoiced: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	expires: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
export const emailVerification = pgTable('email_verification', {
	userId: text('user_id')
		.notNull()
		.references(() => UsersTable.id),
	email: text('email').notNull(),
	token: text('token').notNull(),
	verified: boolean('verified').default(false).notNull(),
	receiveEmail: boolean('recieved_email').default(true).notNull()
});

export const smsVerification = pgTable('sms_verification', {
	userId: text('user_id')
		.notNull()
		.references(() => UsersTable.id),
	phone: text('phone').notNull(),
	verified: boolean('verified').default(false).notNull(),
	receiveSMS: boolean('recieved_sms').default(true).notNull()
});

export const passwordReset = pgTable('password_reset', {
	id: serial('id').notNull().primaryKey(),
	email: text('email').notNull(),
	token: text('token').notNull()
});

// Old Surveys
export const old_SurveyTable = pgTable('old_surveys', {
	surveyid: text('surveyid').primaryKey().notNull(),
	clientid: text('client_id').notNull(),
	surveyTitle: text('survey_title').notNull(),
	surveyDescription: text('survey_desc').notNull(),
	status: Status('status').default('Draft').notNull(),
	target: integer('target'),
	// answeredby: text("answerd_by"),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

// New Surveys
export const SurveyTable = pgTable('survey', {
	surveyid: text().primaryKey().notNull(),
	consumer_id: text().notNull(),
	title: text().notNull(),
	description: text(),
	status: Status('status').default('Draft').notNull(),
	max_responses: doublePrecision().notNull(),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull(),
	survey_expires: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const progressTable = pgTable('agent_progress_table', {
	agentid: text('agent_id')
		.references(() => UsersTable.id)
		.notNull(),
	surveyid: text('surveyid')
		.references(() => SurveyTable.surveyid)
		.notNull(),
	current_ix: integer('current_ix').default(0).notNull()
});

export const agentSurveysTable = pgTable('agent_surv_table', {
	agentid: text('agent_id').notNull(),
	surveyid: text('surveyid')
		.references(() => SurveyTable.surveyid)
		.notNull(),
	survey_completed: boolean('survey_completed').notNull().default(false),
	points: integer('points_earned').notNull()
});

// One and the same
// =============================================================
export const surveyqnsTableV2 = pgTable('survey_qns_optimum', {
	questionId: uuid('questionid').defaultRandom().primaryKey(),
	surveid: text('surveyid').references(() => SurveyTable.surveyid),
	questionT: text('question_type').default('Single').notNull(),
	question: text('question').notNull(),
	likertKey: text('likert_key'),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

export const QuestionOptions = pgTable('question_options', {
	optionId: uuid('optionid').defaultRandom().primaryKey().notNull(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId)
		.notNull(),
	option: text('option').notNull(),
	order_index: integer('order_index').default(0).notNull()
});

// ==============================================================
export const QuestionBranching = pgTable('question_branching', {
	branchId: uuid('branchid').defaultRandom().primaryKey().notNull(),
	surveid: text('surveyid')
		.references(() => SurveyTable.surveyid)
		.notNull(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId)
		.notNull(),
	optionId: uuid('optionid')
		.references(() => QuestionOptions.optionId)
		.notNull(),
	nextQuestionId: uuid('next_questionid')
		.references(() => surveyqnsTableV2.questionId)
		.notNull()
});

export const AnswersTable = pgTable('answers', {
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId)
		.notNull(),
	surveid: text('surveyid')
		.references(() => SurveyTable.surveyid)
		.notNull(),
	optionId: uuid('option_id').references(() => QuestionOptions.optionId),
	rankId: text('rankid'),
	answer: text('answer').notNull(),
	agentId: text('agent_id')
		.references(() => UsersTable.id)
		.notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

export const user_analytics = pgTable('user_analytics', {
	id: serial().primaryKey().notNull(),
	surveyid: text()
		.references(() => SurveyTable.surveyid)
		.notNull(),
	level_of_education: text().notNull(),
	sector: text().notNull(),
	country: text().notNull(),
	state: text(),
	sub: text(),
	client_address: text().notNull(),
	has_completed: boolean().default(false).notNull()
});
export const response_table = pgTable('response_table', {
	id: serial().notNull().primaryKey(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId)
		.notNull(),
	surveid: text('surveyid')
		.references(() => SurveyTable.surveyid)
		.notNull(),
	optionId: uuid('option_id').references(() => QuestionOptions.optionId),
	rankId: text('rankid'),
	answer: text('answer').notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

export const payoutRequests = pgTable('payout_requests', {
	payoutid: uuid('payout_id').defaultRandom().primaryKey(),
	agentid: text('agent_id')
		.references(() => UsersTable.id)
		.notNull(),
	payout: integer('payout').notNull(),
	status: ProcessedStatus('status').notNull().default('pending'),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull(),
	processedby: text('processed_by'),
	processedAt: timestamp('processed_at', {
		withTimezone: true,
		mode: 'date'
	})
});

export const agentTransactions = pgTable('agent_transactions', {
	agentid: text('agentid')
		.references(() => UsersTable.id)
		.notNull(),
	originatorCID: text('originator_conversation_id').notNull(),
	mpesaCID: text('mpesa_conversation_id').notNull(),
	amount: integer('amount').notNull(),
	processedAt: timestamp('processed_at', {
		withTimezone: true,
		mode: 'date'
	})
		.defaultNow()
		.notNull()
});

export const clientTransactions = pgTable('consumer_transactions', {
	id: serial().notNull().primaryKey(),
	TransactionCode: text().notNull(),
	TransAmount: integer().notNull(),
	BillRefNumber: text().notNull(),
	OrgAccountBalance: text().notNull(),
	MSISDN: text().notNull(),
	FirstName: text(),
	MiddleName: text(),
	LastName: text(),
	TransTime: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
export type userInsertSchema = typeof UsersTable.$inferInsert;
// export type ClientDataInsertSchema = typeof clientData.$inferInsert;
export type ConsumerData = typeof consumerDeats.$inferInsert;
export type RespondentInsertSchema = typeof agentData.$inferInsert;
export type surveyGenerateSchema = typeof SurveyTable.$inferInsert;
export type surveySelectSchema = typeof SurveyTable.$inferSelect;
// export type surveyQnsSchema = typeof SurveyQnsTable.$inferInsert
export type surveyQnsSchemaV2 = typeof surveyqnsTableV2.$inferInsert;
export type resData = typeof agentData.$inferSelect;
export type progresType = typeof progressTable.$inferInsert;

export type Session = typeof sessionsTable.$inferSelect;
export type User = typeof UsersTable.$inferSelect;
