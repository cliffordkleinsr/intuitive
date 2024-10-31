import { z } from 'zod';

export const signinCSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.min(2, { message: 'Email must have atleast 2 characters' })
		.max(50, { message: 'Email must have a maximum 50 characters' })
		.email({ message: 'Must be a valid Email Address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(2, { message: 'Password must have atleast 2 characters' })
		.max(50, { message: 'Password must have atleast 50 characters' })
		.trim()
});

export type SigninCSchema = typeof signinCSchema;
