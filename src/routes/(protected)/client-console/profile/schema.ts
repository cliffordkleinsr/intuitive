import { z } from 'zod';

export const profileSchema = z.object({
	company: z.string({ error: 'Company designation is required' }),
	location: z.object({
		country: z.string(),
		state: z.string()
	}),
	phoneno: z.string(),
	sector: z.string({
		error: 'Must be valid Sector'
	})
});

export type ProfileSchema = typeof profileSchema;
