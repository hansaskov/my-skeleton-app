import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth, emailVerificationToken } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { sendEmailVerificationEmail } from '$lib/server/email';
import { schema } from '$lib/schemas/authentication';
import { redirectFromSignin, redirectTo } from '$lib/server/redirects';
import { ratelimit } from '$lib/server/ratelimiter';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	redirectFromSignin(user, url);

	const form = await superValidate(schema.signup);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals, url, getClientAddress }) => {
		const form = await superValidate(request, schema.signup);
		if (!form.valid) return fail(400, { form });

		const ip = getClientAddress();
		const rateLimitAttempt = await ratelimit.email.limit(ip);
		if (!rateLimitAttempt.success) {
			const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
			form.errors._errors = [`Too many requests. Please try again in ${timeRemaining} seconds.`];
			return fail(429, { form });
		}

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
			const path = url.searchParams.get(redirectTo);
			await sendEmailVerificationEmail(user, token.toString(), path);

			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2002' &&
				e.message?.includes('email')
			) {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			}
			if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			}

			console.error(e);
			form.errors._errors ||= [];
			form.errors._errors.push('Unknown error has occured');
			return fail(400, { form });
		}

		return { form };
	}
};
