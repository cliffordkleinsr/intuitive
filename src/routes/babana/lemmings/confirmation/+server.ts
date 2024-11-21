import { db } from '$lib/server/db';
import { clientTransactions } from '$lib/server/db/schema';
import type { Confirmation } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const data: Confirmation = await request.json();

	const {
		TransID,
		TransAmount,
		OrgAccountBalance,
		MSISDN,
		FirstName,
		MiddleName,
		LastName,
		TransTime
	} = data;
	await db.insert(clientTransactions).values({
		TransID,
		TransAmount,
		OrgAccountBalance,
		MSISDN,
		FirstName,
		MiddleName,
		LastName,
		TransTime
	});

	return new Response(JSON.stringify(data));
};
