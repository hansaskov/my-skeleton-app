import { z } from 'zod';

export const userSettingsSchema = z.object({
	username: z.string(),
	fullname: z.string(),
	birthdate: z.string()
});
