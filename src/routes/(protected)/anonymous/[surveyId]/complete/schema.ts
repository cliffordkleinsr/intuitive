import { z } from 'zod';

export const feedbackSchema = z.object({
	name: z
		.string({ error: 'Name is required' })
		.min(2, { message: 'Please enter a valid name' })
		.max(50, { message: 'Your name is too long' })
		.trim(),
	email: z.email({ error: 'Must be a valid Email Address' }),
	feedback: z.string({ error: 'Feedback is required' }).trim()
});

export type FeedbackSchema = typeof feedbackSchema;
