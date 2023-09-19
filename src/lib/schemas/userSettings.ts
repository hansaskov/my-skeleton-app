import { z } from "zod";

export const userSettingsSchema = z.object({
	fullname: z.string(),
	birthdate: z.date(),
	imageUrl: z.string().nullish()
});