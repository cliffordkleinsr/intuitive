import { z } from 'zod';

const checkZodSchema = z.object({
	question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' }),
	option: z
		.string({ required_error: 'Option is required' })
		.min(2, { message: 'Option cannot be blank' })
		.max(500, { message: 'Your option is too long' })
		.array()
});
const radioZodSchema = z.object({
	radio_question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' }),
	radio_option: z
		.string({ required_error: 'Option is required' })
		.min(2, { message: 'Option cannot be blank' })
		.max(500, { message: 'Your option is too long' })
		.array()
});
const rankZodSchema = z.object({
	rnk_question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' }),
	rnk_option: z
		.string({ required_error: 'Option is required' })
		.min(2, { message: 'Option cannot be blank' })
		.max(500, { message: 'Your option is too long' })
		.array()
		.min(5, {
			message: 'Ranking questions must have a minimum of 5 questions'
		})
});

const editZodSchema = z.object({
	option: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Answer must have atleast 2 characters' })
		.max(500, { message: 'Answer must have a maximum 500 characters' }),
	id: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Answer must have atleast 2 characters' })
		.max(500, { message: 'Answer must have a maximum 500 characters' })
});
const singleZodSchema = z.object({
	single_question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' })
});
const rateZodSchema = z.object({
	rating_question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' })
});

const likertZodSchema = z.object({
	question: z
		.string({ required_error: 'Question is required' })
		.min(10, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' }),
	target: z
		.string({ required_error: 'Question is required' })
		.min(2, { message: 'Please add a question' })
		.max(500, { message: 'Your question is too long' })
});

export {
	checkZodSchema,
	radioZodSchema,
	rankZodSchema,
	editZodSchema,
	singleZodSchema,
	rateZodSchema,
	likertZodSchema
};
