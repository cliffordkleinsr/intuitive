import { z } from 'zod';
import cty from '$lib/json/counties.json';

export const counties = cty;
type Counties = (typeof counties)[number]['name'];

export const resetSchema = z
	.object({
		dateofbirth: z
			.string()
			.min(1, { message: 'A date of birth is required.' })
			.refine(
				(val) => {
					const age = new Date().getFullYear() - new Date(val).getFullYear();
					// Convert both to timestamps for comparison
					const hasHadBirthday = new Date(val).setFullYear(new Date().getFullYear()) <= Date.now();
					return age > 18 || (age === 18 && hasHadBirthday);
				},
				{
					message: 'You must be above the age of 18 to register'
				}
			),
		phoneno: z
			.string()
			.min(10, { message: 'Phone number must be more equal to ten digits' })
			.regex(
				/^(?:(?:\+254)|0)?(?:(?:11[01])|(?:7(?:0[0-9]|1[0-9]|2[0-9]|4[0-3]|4[5-6]|48|5[7-9]|6[8-9]|9[0-9])))[0-9]{6}$/gm,
				{
					message: 'Must be a valid Safaricom phone number'
				}
			),
		county: z.enum(counties.map((f) => f.name) as [Counties, ...Counties[]], {
			errorMap: () => ({ message: 'Please select a valid County.' })
		}),
		subctys: z
			.string({
				required_error: 'Must be valid Sub County.'
			})
			.min(2, { message: 'Please select a valid sub county' })
			.max(25, { message: 'Please select a valid sub county' }),
		income: z.string().optional(),
		// .default("Select an income bracket"),
		employment: z
			.string({
				required_error: 'Must be valid Employment Bracket.'
			})
			.min(2, { message: 'Please select a Employment Bracket.' }),
		education: z
			.string({
				required_error: 'Must be valid Education Bracket.'
			})
			.min(2, { message: 'Must be a Education Bracket.' }),
		sector: z.string().optional(),
		referal: z.string().optional(),
		// .default("Select a Sector"),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
				message: 'must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
			})
			.min(2, { message: 'Password must have atleast 2 characters' })
			.max(50, { message: 'Password must have atleast 50 characters' })
			.trim(),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
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
