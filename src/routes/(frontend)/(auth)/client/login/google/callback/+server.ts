import type { RequestHandler } from './$types';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import type { OAuth2Tokens } from 'arctic';
import type { GoogleIdTokenPayload } from '$lib/types';
import { createGoogleUser, getUserFromGoogleId } from '$lib/server/db/db_utils';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state') ?? null;
	const codeVerifier = cookies.get('google_code_verifier') ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}

	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;

	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (error) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenPayload;
	const googleUserId = claims.sub;
	const username = claims.name as string;
	const email = claims.email as string;
	const existingUser = await getUserFromGoogleId(googleUserId);
	if (typeof existingUser !== 'undefined') {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
	// TODO: Replace this with your own DB query.
	const [user] = await createGoogleUser(googleUserId, username, email);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
	// cookie to update-registry
	cookies.set('update_registry', 'true', {
		path: '/',
		maxAge: 60 * 60 * 24 * 5 // 5days
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
};
