import { z } from 'zod';

export const billingSchema = z.object({
	phone: z.string().optional(),
	price: z.string().optional(),
	plan: z.string().optional()
});
