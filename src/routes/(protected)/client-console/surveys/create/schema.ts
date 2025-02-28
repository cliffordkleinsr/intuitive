import { z } from 'zod';
export let schema = z.object({
	title: z.string().nonempty(),
	description: z.string().optional()
});
