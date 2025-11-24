import { z } from 'zod';

export const subjectSchema = z.object({
	name: z
		.string({ error: 'Name is required' })
		.min(2, { message: 'Please enter a valid name' })
		.max(50, { message: 'Your name is too long' })
		.trim(),
	email: z.email({ error: 'Must be a valid Email Address' }),
	subject: z
		.string({ error: 'Subject is required' })
		.min(4, { message: 'Please enter a valid subject' })
		.max(200, { message: 'Your name is too long' })
		.trim()
});

export type SubjectSchema = typeof subjectSchema;
