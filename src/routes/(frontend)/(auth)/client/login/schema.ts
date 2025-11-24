import { z } from 'zod/v4';

export const loginSchema = z.object({
	email: z.email({ error: 'Must be a valid Email Address' }),
	// .email({ message: 'Must be a valid Email Address' }),
	password: z
		.string({ error: 'Password is required' })
		.min(2, { message: 'Password must have atleast 2 characters' })
		.max(50, { message: 'Password must have atleast 50 characters' })
		.trim()
});

export type LoginSchema = typeof loginSchema;
