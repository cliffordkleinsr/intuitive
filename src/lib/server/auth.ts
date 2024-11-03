import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

// const DAY_IN_MS = 1000 * 60 * 60 * 24;
// Changed time constants
const HOUR_IN_MS = 1000 * 60 * 60; // 1 hour in milliseconds
const RENEW_THRESHOLD = HOUR_IN_MS / 2; // 30 minutes in milliseconds

export const sessionCookieName = 'session';

function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(userId: string): Promise<table.Session> {
	const token = generateSessionToken();
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + HOUR_IN_MS) //DAY_IN_MS * 30)
	};
	await db.insert(table.sessionsTable).values(session);
	return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(table.sessionsTable).where(eq(table.sessionsTable.id, sessionId));
}

export async function validateSession(sessionId: string) {
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: {
				id: table.UsersTable.id,
				fullname: table.UsersTable.fullname,
				email: table.UsersTable.email,
				role: table.UsersTable.role,
				isEmailVerified: table.UsersTable.isEmailVerified,
				gender: table.UsersTable.gender,
				age: table.UsersTable.age,
				pfp: table.UsersTable.pfp
			},
			session: table.sessionsTable
		})
		.from(table.sessionsTable)
		.innerJoin(table.UsersTable, eq(table.sessionsTable.userId, table.UsersTable.id))
		.where(eq(table.sessionsTable.id, sessionId));
	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.UsersTable).where(eq(table.sessionsTable.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - RENEW_THRESHOLD; //DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + HOUR_IN_MS); //* 30);
		await db
			.update(table.sessionsTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.sessionsTable.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSession>>;
