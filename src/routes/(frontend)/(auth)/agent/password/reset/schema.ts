import { z } from 'zod';

export const emailSchema = z.object({
	email: z
		.string()
		.min(2, { message: 'Email is required' })
		.max(50, { message: 'Must be a valid Email Address' })
		.email({ message: 'Must be a valid Email Address' })
});
export type EmailSchema = typeof emailSchema;
