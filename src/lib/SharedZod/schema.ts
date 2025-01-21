import { z } from 'zod';

const loginSchema = z.object({
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
const ticketSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(2, { message: 'Enter a valid name' })
		.max(50, { message: 'Name name is too long' })
		.trim(),
	email: z
		.string()
		.min(2, { message: 'Email must be valid' })
		.max(50, { message: 'Email is too long' })
		.email({ message: 'Must be a valid Email Address' }),
	phoneno: z
		.string()
		.regex(/^(?:(?:\+254)|0)?([17])(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6}$/gm, {
			message: 'Must be a valid Kenyan phone number'
		}),
	issue: z.string().min(2, { message: 'Issue is required' }).max(50),
	priority: z.string().min(2, { message: 'Priority is required' }).max(50),
	description: z
		.string({ required_error: 'Description is required' })
		.min(15, { message: 'Enter a valid Description' })
		.max(150, { message: 'Description exceeds the limit of 150 chars' })
		.trim()
});

export { loginSchema, ticketSchema };
