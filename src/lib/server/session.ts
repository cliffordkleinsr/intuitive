import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
// ...

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set(auth.sessionCookieName, token, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		expires: expiresAt,
		secure: !dev
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set(auth.sessionCookieName, "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: ".",
		secure: !dev
	});
}