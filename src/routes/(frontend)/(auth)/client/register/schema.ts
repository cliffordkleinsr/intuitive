import { z } from 'zod';
// import cty from '$lib/json/counties.json';

// export const counties = cty;
// type Counties = (typeof counties)[number]['name'];

export const registerCSchema = z
	.object({
		fullname: z
			.string({ required_error: 'Name is required' })
			.min(2, { message: 'Name must be more than 2 characters' })
			.max(50, { message: 'Name must have a maximum of 50 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.min(2, { message: 'Email must have atleast 2 characters' })
			.max(50, { message: 'Email cant have a maximum 50 characters' })
			.email({ message: 'Must be a valid Email Address' }),
		company: z
			.string({ required_error: 'Company designation is required' })
			.min(2, { message: 'Company designation must have atleast 2 characters' })
			.max(50, { message: 'Email cant have a maximum 50 characters' }),
		// phoneno: z
		// 	.string({ required_error: 'Phone number is required' })
		// 	.min(12, { message: 'Phone number must be more equal to ten digits' })
		// 	.regex(
		// 		/^(?:(?:\+254)|0)?(?:(?:11[01])|(?:7(?:0[0-9]|1[0-9]|2[0-9]|4[0-3]|4[5-6]|48|5[7-9]|6[8-9]|9[0-9])))[0-9]{6}$/gm,
		// 		{
		// 			message: 'Must be a valid Safaricom phone number'
		// 		}
		// 	).trim(),
		phoneno: z.string().nonempty(),
		location: z.object({
			country: z.string(),
			state: z.string()
		}),
		// county: z
		// 	.enum(counties.map((f) => f.name) as [Counties, ...Counties[]], {
		// 		errorMap: () => ({ message: 'Please select a valid County.' })
		// 	}),
		// county: z.string().nonempty(),
		// subctys: z.string().nonempty(),
		// subctys: z
		// 	.string({
		// 		required_error: 'Must be valid Sub County.'
		// 	})
		// 	.min(2, { message: 'Please select a valid sub county' })
		// 	.max(25, { message: 'Please select a valid sub county' }),
		sector: z
			.string({
				required_error: 'Must be valid Sector'
			})
			.min(2, { message: 'Must be a valid Sector' }),
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

export type RegisterCSchema = typeof registerCSchema;
