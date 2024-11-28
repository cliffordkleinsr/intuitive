import { handleExternal, handleLoginRedirect } from '$lib/custom/functions/helpers';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	agentData,
	agentSurveysTable,
	AnswersTable,
	payoutRequests,
	smsVerification,
	SurveyTable
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { deleteCUser } from '$lib/server/db/db_utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async ({ locals: { user }, cookies, url }) => {
	const validation = false;
	if (!user) {
		// check external user
		const extrenal = url.searchParams.get('external');
		if (extrenal) {
			redirect(302, handleExternal('/agent/register', url));
		} else {
			redirect(
				302,
				handleLoginRedirect('/agent/signin', url),
				{
					type: 'error',
					message: 'Not Authorised'
				},
				cookies
			);
		}
		// redirect('/respondent/signin', {type: "error", message:"You Must Be logged In to view this page"}, cookies)
	}
	if (validation) {
		const [query] = await db
			.select({
				phone: smsVerification.phone,
				status: smsVerification.verified
			})
			.from(smsVerification)
			.where(eq(smsVerification.userId, user?.id as string));
		if (!query.status) {
			redirect(302, '/agent/verify');
		}
	}
	if (user.role === 'CLIENT') {
		redirect(
			302,
			handleLoginRedirect('/', url),
			{
				type: 'error',
				message: 'Not Allowed'
			},
			cookies
		);
	}

	return {
		AuthedUser: user.fullname,
		profile: user.pfp,
		url: url.pathname
	};
};
