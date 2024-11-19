import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';

let redis: Redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export const ratelimit = {
	create: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:create',
		limiter: Ratelimit.slidingWindow(1, '4h')
	}),

	delete: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:delete',
		limiter: Ratelimit.slidingWindow(1, '15s')
	})
};
