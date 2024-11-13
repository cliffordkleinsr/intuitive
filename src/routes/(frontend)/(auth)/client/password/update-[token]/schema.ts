import { z } from 'zod';

export const resetpasSchema = z
	.object({
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
				message: 'must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
			})
			.min(2, { message: 'Please input a valid password' })
			.max(50, { message: 'Your password is too long' })
			.trim(),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
				message: 'must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
			})
			.min(2, { message: 'Please input a valid password' })
			.max(50, { message: 'Your password is too long' })
			.trim()
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (password !== passwordConfirm) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password Must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Confirm Password and Password Must match',
				path: ['passwordConfirm']
			});
		}
	});

export type ResetPassword = typeof resetpasSchema;
