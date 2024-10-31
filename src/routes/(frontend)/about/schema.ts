import { z } from 'zod';

export const subjectSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(2, { message: 'Please enter a valid name' })
		.max(50, { message: 'Your name is too long' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.min(2, { message: 'Please enter a valid email' })
		.max(50, { message: 'Your email is invalid' })
		.email({ message: 'Must be a valid Email Address' }),
	subject: z
		.string({ required_error: 'Subject is required' })
		.min(4, { message: 'Please enter a valid subject' })
		.max(200, { message: 'Your name is too long' })
		.trim()
});

export type SubjectSchema = typeof subjectSchema;
