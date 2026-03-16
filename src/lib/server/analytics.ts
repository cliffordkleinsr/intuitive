import { redis } from './zedis';

export type AuthEvent = {
	action: 'signin' | 'signup';
	time: string;
};

export async function getAuthAnalytics() {
	const raw = await redis.lrange('auth_api_calls', 0, 5000);

	const events: AuthEvent[] = raw.map((r) => JSON.parse(r));

	const signinSeries = events
		.filter((e) => e.action === 'signin')
		.map((e) => ({
			date: new Date(e.time),
			count: 1
		}));

	const signupSeries = events
		.filter((e) => e.action === 'signup')
		.map((e) => ({
			date: new Date(e.time),
			count: 1
		}));

	return {
		signinSeries,
		signupSeries,
		signinTotal: signinSeries.length,
		signupTotal: signupSeries.length
	};
}