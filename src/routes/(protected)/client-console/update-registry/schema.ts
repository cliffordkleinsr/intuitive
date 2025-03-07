import { z } from 'zod';
export let schema = z.object({
	email: z.string().nonempty(),
	company: z.string().min(3).max(20),
	phoneno: z.string().nonempty(),
	location: z.object({
		country: z.string(),
		state: z.string()
	}),
	// county: z.string().nonempty(),
	// subctys: z.string().nonempty(),
	sector: z.string().nonempty()
});
