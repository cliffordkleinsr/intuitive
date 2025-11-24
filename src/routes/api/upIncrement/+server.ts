// src/routes/api/counter/+server.ts
import { json } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';

// Initialize Redis from env vars
const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export async function GET() {
	const identifier = 'signup_api_call_counter';

	try {
		// Increment the API call counter
		const count = await redis.incr(identifier);

		// Retrieve last called timestamp
		const lastCalled = await redis.get<string>('last_called_signup');
		const lastCalledAt = lastCalled ?? 'Never';

		// Update last called timestamp
		await redis.set('last_called_signup', new Date().toISOString());

		return json({
			success: true,
			count,
			lastCalled: lastCalledAt
		});
	} catch (error) {
		console.error('Redis error:', error);

		return json(
			{
				success: false,
				message: 'Error interacting with Redis'
			},
			{ status: 500 }
		);
	}
}
