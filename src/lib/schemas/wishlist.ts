import { z } from 'zod';

export const wishlistSchema = z.object({
	name: z.string().min(1),
	is_public: z.boolean()
});
