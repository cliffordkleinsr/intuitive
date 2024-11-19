import type { MpesaB2CResult } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as MpesaB2CResult;

		// Extract key information
		const {
			ResultCode,
			ResultDesc: message,
			OriginatorConversationID,
			ConversationID,
			TransactionID,
			ResultParameters
		} = body.Result;

		// Process successful transaction
		if (ResultCode === 0) {
			// Extract important parameters from ResultParameters
			const parameters = ResultParameters.ResultParameter.reduce(
				(acc, param) => {
					acc[param.Key] = param.Value;
					return acc;
				},
				{} as Record<string, string | number>
			);

			// Log successful transaction
			console.log('Successful B2C Transaction:', {
				message,
				OriginatorConversationID,
				ConversationID,
				TransactionID,
				parameters
			});

			// Here you would typically:
			// 1. Update your database with the transaction status
			// 2. Notify your application's users if necessary
			// 3. Trigger any required business logic

			return json({
				success: true,
				message,
				transactionId: TransactionID
			});
		}

		// Handle failed transaction
		console.error('Failed B2C Transaction:', {
			ResultCode,
			message,
			OriginatorConversationID
		});

		return json({
			success: false,
			message
		});
	} catch (error) {
		console.error('Error processing M-Pesa result callback:', error);
		return json(
			{
				success: false,
				message: 'Failed to process result callback'
			},
			{ status: 500 }
		);
	}
};
