import { z } from 'zod';

export const fileSchema = z.object({
	csv: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
});

export type Fileschema = typeof fileSchema;
