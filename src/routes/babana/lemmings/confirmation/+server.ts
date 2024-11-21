import { db } from '$lib/server/db';
import { clientTransactions } from '$lib/server/db/schema';
import type { Confirmation } from '$lib/types';
import type { RequestHandler } from './$types';

function convertMpesaTimestamp(timestamp: any) {
	// Break down the timestamp
	const year = timestamp.slice(0, 4);
	const month = timestamp.slice(4, 6) - 1; // Months are 0-indexed in JS
	const day = timestamp.slice(6, 8);
	const hours = timestamp.slice(8, 10);
	const minutes = timestamp.slice(10, 12);
	const seconds = timestamp.slice(12, 14);

	// Create a new Date object
	return new Date(year, month, day, hours, minutes, seconds);
}
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.text();
	const {
		TransID,
		TransAmount,
		OrgAccountBalance,
		MSISDN,
		FirstName,
		MiddleName,
		LastName,
		TransTime
	}: Confirmation = JSON.parse(data);
	await db.insert(clientTransactions).values({
		TransactionCode: TransID,
		TransAmount: parseInt(TransAmount),
		OrgAccountBalance,
		MSISDN,
		FirstName,
		MiddleName,
		LastName,
		TransTime: convertMpesaTimestamp(TransTime)
	});

	return new Response(data);
};
