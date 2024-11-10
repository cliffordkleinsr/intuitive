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

// for rankers
const rankBuilder = (aspects: string[]) => {
	const rankSchema = z.object(
		Object.fromEntries(aspects.map((aspect) => [aspect, z.enum(['null', '1', '2', '3', '4', '5'])]))
	);
	return rankSchema;
};
export { openEndedSchema, enumBuilder, rankBuilder };

type OpenEndedSchema = typeof openEndedSchema;
type OptionalSchema = ReturnType<typeof enumBuilder>;
type RankSchema = ReturnType<typeof rankBuilder>;
export type { OpenEndedSchema, OptionalSchema, RankSchema };
