import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { redis } from '$lib/server/zedis';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { action } = await request.json();
        if (!action) {
			return json({ success: false, message: "Missing action" }, { status: 400 });
		}
        const entry = {
			action,
			time: new Date().toISOString()
		};
        const key = "auth_api_calls";

		await redis.lpush(key, JSON.stringify(entry));
        // limit list size
		await redis.ltrim(key, 0, 999);

		const count = await redis.llen(key);
        return json({
			success: true,
			count
		});
    } catch (error) {
        return json(
			{ success: false, message: "Redis error" },
			{ status: 500 }
		);
    }
};