import { pgTable, serial, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
// refs
export const UserRole = pgEnum('UserRole', ['ADMIN', 'CLIENT', 'AGENT']);

// Model USERS
export const UsersTable = pgTable('users', {
	id: text('id').primaryKey(),
	fullname: text('fullname').notNull(),
	email: text('email').notNull().unique(),
	isEmailVerified: boolean('is_email_verified').notNull().default(false),
	password: text('password').notNull(),
	role: UserRole('userole').default('AGENT').notNull(),
	age: integer('age'),
	gender: text('gender'),
	pfp: text('profile_pic'),
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

export type Session = typeof sessionsTable.$inferSelect;

export type User = typeof UsersTable.$inferSelect;
