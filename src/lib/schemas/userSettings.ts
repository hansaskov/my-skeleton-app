import { z } from "zod";



export const userSetupSchema = z.object({
	fullname: z.string(),
	birthdate: z.date(),
	imageUrl: z.string().nullish()
});

export const userSettingsSchema = z.object({
	fullname: z.string(),
	birthdate: z.string(),
})