import { db } from '$lib/server/db';
import { feedbackCollection } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const feedback = await db
		.select({
			name: feedbackCollection.name,
			email: feedbackCollection.email,
			message: feedbackCollection.feedback,
			timestamp: feedbackCollection.created_at
		})
		.from(feedbackCollection);
	return {
		feedback
	};
}) satisfies PageServerLoad;
