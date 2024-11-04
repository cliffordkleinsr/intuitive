import { z } from 'zod';

const questionZodSchema = z.object({
	answer: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Please answer the question' })
		.max(500, { message: 'Your answer is too long' })
});
const rateZodSchema = z.object({
	answer: z
		.string({ required_error: 'Option is required' })
		.min(1, { message: 'Option is required' })
});
const rankansZodSchema = z.object({
	id: z.coerce
		.number()
		.gte(1, { message: 'Please select all options for this question' })
		.transform((val) => val.toString()),
	option: z
		.string({ required_error: 'Option is required' })
		.min(2, { message: 'Option must have atleast 2 characters' })
		.max(500, { message: 'Option must have a maximum 500 characters' })
});
const checkboxansZodSchema = z.object({
	id: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Answer must have atleast 2 characters' })
		.max(500, { message: 'Answer must have a maximum 500 characters' }),
	answer: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Answer must have atleast 2 characters' })
		.max(500, { message: 'Answer must have a maximum 500 characters' })
});

export { questionZodSchema, rateZodSchema, rankansZodSchema, checkboxansZodSchema };
