import {
	pgTable,
	text,
	integer,
	timestamp,
	boolean,
	pgEnum,
	serial,
	doublePrecision,
	uuid
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
	id: text('id').primaryKey().notNull(),
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
}).enableRLS();

export const consumerDeats = pgTable('consumer_details', {
	consumerid: text()
		.references(() => UsersTable.id, { onDelete: 'cascade' })
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
}).enableRLS();

export const sessionsTable = pgTable('user_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => UsersTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
}).enableRLS();

export const costTable = pgTable('cost_table', {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	cost: text().notNull(),
	max_responses: integer().notNull(),
	demographics: boolean().notNull().default(false),
	branding: boolean().notNull().default(false)
}).enableRLS();

export const userPackage = pgTable('user_package', {
	id: serial().notNull().primaryKey(),
	consumerid: text()
		.references(() => UsersTable.id, { onDelete: 'cascade' })
		.notNull(),
	package_id: integer()
		.references(() => costTable.id)
		.notNull(),
	transaction_code: text().notNull(),
	invoiced: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	expires: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
}).enableRLS();

export const passwordReset = pgTable('password_reset', {
	id: serial('id').notNull().primaryKey(),
	email: text('email').notNull(),
	token: text('token').notNull()
}).enableRLS();

export const SurveyTable = pgTable('survey', {
	surveyid: text().primaryKey().notNull(),
	consumer_id: text()
		.references(() => UsersTable.id, { onDelete: 'cascade' })
		.notNull(),
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
}).enableRLS();

export const surveyqnsTableV2 = pgTable('survey_questions', {
	questionId: uuid('questionid').defaultRandom().primaryKey(),
	surveid: text('surveyid').references(() => SurveyTable.surveyid, { onDelete: 'cascade' }),
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
}).enableRLS();

export const QuestionOptions = pgTable('question_options', {
	optionId: uuid('optionid').defaultRandom().primaryKey().notNull(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId, { onDelete: 'cascade' })
		.notNull(),
	option: text('option').notNull(),
	order_index: integer('order_index').default(0).notNull()
}).enableRLS();

export const QuestionBranching = pgTable('question_branching', {
	branchId: uuid('branchid').defaultRandom().primaryKey().notNull(),
	surveid: text('surveyid')
		.references(() => SurveyTable.surveyid, { onDelete: 'cascade' })
		.notNull(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId, { onDelete: 'cascade' })
		.notNull(),
	optionId: uuid('optionid')
		.references(() => QuestionOptions.optionId)
		.notNull(),
	nextQuestionId: uuid('next_questionid')
		.references(() => surveyqnsTableV2.questionId, { onDelete: 'cascade' })
		.notNull()
}).enableRLS();

export const user_analytics = pgTable('user_analytics', {
	id: serial().primaryKey().notNull(),
	surveyid: text()
		.references(() => SurveyTable.surveyid, { onDelete: 'cascade' })
		.notNull(),
	level_of_education: text().notNull(),
	sector: text().notNull(),
	country: text().notNull(),
	state: text(),
	sub: text(),
	client_address: text().notNull(),
	has_completed: boolean().default(false).notNull()
}).enableRLS();

export const response_table = pgTable('response_table', {
	id: serial().notNull().primaryKey(),
	questionId: uuid('questionid')
		.references(() => surveyqnsTableV2.questionId, { onDelete: 'cascade' })
		.notNull(),
	surveid: text('surveyid')
		.references(() => SurveyTable.surveyid, { onDelete: 'cascade' })
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
}).enableRLS();

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
}).enableRLS();
