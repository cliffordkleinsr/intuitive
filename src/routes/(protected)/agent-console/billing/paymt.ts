import { z } from 'zod';

export const amountSchema = z.object({
	amount: z.coerce
		.number()
		.multipleOf(50, { message: 'Amount must be a multiple of 50' })
		.gte(1, { message: 'Amount cannot be zero' })
});

export type AmountSchema = typeof amountSchema;
