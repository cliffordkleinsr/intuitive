import type { RequestHandler } from './$types';
import { simplifiedAnalytics } from '$lib/server/db/db_utils';

export const GET: RequestHandler = async ({ params: { surveyid }, url }) => {
	const searchParams = url.searchParams;
	const limit = searchParams.get('limit');
	const select = searchParams.get('question');
	const skip = searchParams.get('skip');
	let analytics = await simplifiedAnalytics(surveyid);
	if (skip) {
		analytics = analytics.slice(parseInt(skip));
	}
	if (limit) {
		const filtered = analytics.slice(0, parseInt(limit));
		if (!filtered) throw new Error('Wrong match filter');
		return new Response(JSON.stringify(filtered), { status: 200 });
	}

	if (select) {
		const filtered = analytics.find((el) => el.question.includes(select));
		if (!filtered) throw new Error('Wrong match filter');
		return new Response(JSON.stringify(filtered), { status: 200 });
	}
	return new Response(JSON.stringify(analytics), { status: 200 });
};
