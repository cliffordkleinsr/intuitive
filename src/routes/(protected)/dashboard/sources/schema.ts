import { z } from 'zod';

export const utmBuilder = z.object({
	baseUrl: z.optional(z.string()),
	utmSource: z.string({ required_error: 'UTM Source is required' }),
	utmMedium: z.string({ required_error: 'UTM Medium is required' }),
	utmCampaign: z.string({ required_error: 'UTM Campaign is required' })
});

export type UTMBuilder = typeof utmBuilder;
