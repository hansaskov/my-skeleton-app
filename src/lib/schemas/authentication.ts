import { z } from 'zod';

function containsNumber(str: string) {
	return Array.from(str).some((c) => c >= '0' && c <= '9');
}

const auth = z.object({
	remember: z.boolean().optional().default(false),
	email: z.string().trim().min(1).max(255).email().toLowerCase(),
	password: z
		.string()
		.min(8)
		.max(255)
		.refine(containsNumber, { message: 'Password must contain at least one number' })
});

export const schema = {
	login: auth,
	signup: auth,
	email: auth.pick({ email: true }),
	password: auth.pick({ password: true })
};
