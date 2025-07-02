import { z } from 'zod';

// schemas
const openEndedSchema = z.object({
	answer: z
		.string({ required_error: 'Answer is required' })
		.min(2, { message: 'Please answer the question' })
		.max(500, { message: 'Your answer is too long' })
});
// for options
const enumBuilder = (options: string[]) => {
	const optionalSchema = z.object({
		type: z.enum(options as [string, ...string[]])
	});

	return optionalSchema;
};
// for checkbox
const multipleSchema = z.object({
	items: z
		.array(
			z.object({
				id: z.string().uuid(), // if your IDs are UUIDs
				label: z.string().min(1) // if labels can't be empty
			})
		)
		.min(1, { message: 'You have to select at least one item.' })
});
// for rankers
const rankBuilder = (aspects: string[]) => {
	const rankSchema = z.object(
		Object.fromEntries(aspects.map((aspect) => [aspect, z.enum(['null', '1', '2', '3', '4', '5'])]))
	);
	return rankSchema;
};
// for rating
const ratingSchema = z.object({
	answer: z.number().min(1, 'Please select a rating').max(5)
});

// for select
const buildSelectSchema = (numOptions: number) => {
	const shape: Record<string, z.ZodString> = {};
	for (let i = 0; i < numOptions; i++) {
		shape[`option${i}`] = z.string({
			required_error: `Please select an option for question ${i + 1}`
		});
	}
	return z.object(shape);
};

export {
	openEndedSchema,
	multipleSchema,
	ratingSchema,
	enumBuilder,
	buildSelectSchema,
	rankBuilder
};

type OpenEndedSchema = typeof openEndedSchema;
type MultipleSchema = typeof multipleSchema;
type OptionalSchema = ReturnType<typeof enumBuilder>;
type BuildSelectSchema = ReturnType<typeof buildSelectSchema>;
type RankSchema = ReturnType<typeof rankBuilder>;
type RateSchema = typeof ratingSchema;
export type {
	OpenEndedSchema,
	MultipleSchema,
	OptionalSchema,
	BuildSelectSchema,
	RankSchema,
	RateSchema
};
