import { z } from 'zod';
export let schema = z.object({
	education: z.string().optional(),
	sector: z.string().optional(),
	loc: z.object({
		country: z.string(),
		state: z.string().optional()
	}),
	location: z
		.object({
			accuracy: z.number(),
			latitude: z.number(),
			longitude: z.number(),
			altitude: z.number().nullable(),
			altitudeAccuracy: z.number().nullable(),
			heading: z.number().nullable(),
			speed: z.number().nullable()
		})
		.optional()
});
