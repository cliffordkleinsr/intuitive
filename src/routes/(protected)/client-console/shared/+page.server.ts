import { retSurveyInfo } from '$lib/server/db/db_utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const userid = locals.user?.id as string;
	const [, , livesurveys] = await retSurveyInfo(userid);
	return { livesurveys };
}) satisfies PageServerLoad;
