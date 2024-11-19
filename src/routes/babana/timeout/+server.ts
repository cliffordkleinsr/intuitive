import type { MpesaTimeoutResult } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as MpesaTimeoutResult;

		const {
			ResultCode,
			ResultDesc: message,
			OriginatorConversationID,
			ConversationID
		} = body.Result;

		// Log timeout event
		console.error('B2C Transaction Timeout:', {
			ResultCode,
			message,
			OriginatorConversationID,
			ConversationID
		});

		// Here you would typically:
		// 1. Update your database to mark the transaction as timed out
		// 2. Implement retry logic if needed
		// 3. Notify relevant parties about the timeout

		return json({
			success: false,
			message: 'Transaction timed out',
			originator: OriginatorConversationID
		});
	} catch (error) {
		console.error('Error processing M-Pesa timeout callback:', error);
		return json(
			{
				success: false,
				message: 'Failed to process timeout callback'
			},
			{ status: 500 }
		);
	}
};
