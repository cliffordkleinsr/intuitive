import { z } from 'zod';

export const signupSchema = z
	.object({
		fullname: z
			.string({ error: 'Name is required' })
			.min(2, { message: 'Name must be more than 2 characters' })
			.max(50, { message: 'Name must have a maximum of 50 characters' })
			.trim(),

		email: z.email({ error: 'Must be a valid Email Address' }),
		phoneno: z.string().nonempty(),
		password: z
			.string({ error: 'Password is required' })
			.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
				message: 'must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
			})
			.min(2, { message: 'Password must have atleast 2 characters' })
			.max(50, { message: 'Password must have atleast 50 characters' })
			.trim(),
		passwordConfirm: z
			.string({ error: 'Password is required' })
			.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
				message: 'must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
			})
			.min(2, { message: 'Password must have atleast 2 characters' })
			.max(50, { message: 'Password must have atleast 50 characters' })
			.trim()
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (password !== passwordConfirm) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords and Confirm Password Must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords and Confirm Password Must match',
				path: ['passwordConfirm']
			});
		}
	});

export type SignupSchema = typeof signupSchema;
