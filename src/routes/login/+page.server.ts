import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia-auth';
import { schema } from '$lib/schemas/authentication';
import { redirectFromSignin } from '$lib/server/redirects';
import { ratelimit } from '$lib/server/ratelimit/ratelimiter';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	redirectFromSignin(user, url);

	// Validates Page Schema
	const form = await superValidate(schema.login);
	const message = url.searchParams.get('message');
	return { form, message };
};

export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		const form = await superValidate(request, schema.login);
		if (!form.valid) return fail(400, { form });

		const ip = getClientAddress();
		const rateLimitAttempt = await ratelimit.auth.limit(ip);

		if (!rateLimitAttempt.success) {
			const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
			return setError(form, `Too many requests. Please try again in ${timeRemaining} seconds.`);
		}

		try {
			const key = await auth.useKey('email', form.data.email, form.data.password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError) {
				switch (e.message) {
					case 'AUTH_INVALID_KEY_ID':
						return setError(form, 'Incorrect credentials');
					case 'AUTH_INVALID_PASSWORD':
						return setError(form, 'Incorrect credentials');
					case 'AUTH_OUTDATED_PASSWORD':
						return setError(form, 'Outdated password');
				}
			}
			console.error(e);
			return setError(form, 'Something went wront, please try again');
		}

		return { form };
	}
};
