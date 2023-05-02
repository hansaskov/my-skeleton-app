import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth, emailVerificationToken } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { sendEmailVerificationEmail } from '$lib/server/email';

function containsNumber(str: string) {
	return Array.from(str).some((c) => c >= '0' && c <= '9');
}

const schema = z.object({
	email: z.string().trim().min(1).max(255).email(),
	password: z
		.string()
		.min(8)
		.max(255)
		.refine(containsNumber, { message: 'Password must contain at least one number' })
});

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const {user } = await locals.auth.validateUser();
	if (user && user.userInfoSet == false) throw redirect(302, '/signup/setup');
	if (user) throw redirect(302, '/');

	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: form.data.email,
					password: form.data.password
				},
				attributes: {
					email: form.data.email,
					email_verified: false,
					user_info_set: false
				}
			});
			const session = await auth.createSession(user.userId);
			const token = await emailVerificationToken.issue(user.userId);
			await sendEmailVerificationEmail(user.email, token.toString());

			locals.auth.setSession(session);
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				error.message?.includes('email')
			) {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			}
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			} else {
				console.error(error);
				return fail(400, { form, message: 'Unknown error' });
			}
		}

		return { form };
	}
};
