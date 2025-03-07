import { Google } from 'arctic';
import { dev } from '$app/environment';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

const url = dev
	? 'http://localhost:5173/client/login/google/callback'
	: 'https://int-insights.com/client/login/google/callback';
export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, url);
