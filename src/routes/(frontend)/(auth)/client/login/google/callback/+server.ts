import type { RequestHandler } from './$types';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import type { OAuth2Tokens } from 'arctic';
import type { GoogleIdTokenPayload } from '$lib/types';
import { createGoogleUser, getUserFromGoogleId } from '$lib/server/db/db_utils';
import { redirect } from 'sveltekit-flash-message/server';

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
	const picture = claims.picture as string;
	const existingUser = await getUserFromGoogleId(googleUserId);
	if (typeof existingUser !== 'undefined') {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
		redirect(302, '/client-console', { type: 'success', message: 'User logged in' }, cookies);
		// return new Response(null, {
		// 	status: 302,
		// 	headers: {
		// 		Location: '/client-console'
		// 	}
		// });
	}
	// TODO: Replace this with your own DB query.
	const [user] = await createGoogleUser(googleUserId, username, picture);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
	// cookie to update-registry
	// Done change to db call
	// cookies.set('update_registry', 'true', {
	// 	path: '/',
	// 	maxAge: 60 * 60 * 24 * 5 // 5days
	// });
	// Done show toast
	redirect(
		302,
		'/client-console/update-registry',
		{ type: 'success', message: 'User Registered Successfully' },
		cookies
	);
	// return new Response(null, {
	// 	status: 302,
	// 	headers: {
	// 		Location: '/client-console/update-registry'
	// 	}
	// });
};
