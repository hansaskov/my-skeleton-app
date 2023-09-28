import { message, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia';
import { schema } from '$lib/schemas/authentication';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { ratelimit } from '$lib/server/ratelimit/ratelimiter';
import type { Message } from '$lib/schemas/message';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validate()
	]);
	if (!session) return { form };

	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		const form = await superValidate<typeof schema.login, Message>(request, schema.login);
		if (!form.valid) return fail(400, { form });

		try {
			const ip = getClientAddress();
			const rateLimitAttempt = await ratelimit.auth.limit(ip);

			if (!rateLimitAttempt.success) {
				const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
				return message(form, {
					type: 'error',
					text: `Too many requests. Please try again in ${timeRemaining} seconds.`
				});
			}

			const key = await auth.useKey('email', form.data.email, form.data.password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError) {
				switch (e.message) {
					case 'AUTH_INVALID_KEY_ID':
						return message(form, {
							type: 'error',
							text: 'Incorrect credentials, please try again 😊'
						});
					case 'AUTH_INVALID_PASSWORD':
						return message(form, {
							type: 'error',
							text: 'Incorrect credentials, please try again 😊'
						});
					case 'AUTH_OUTDATED_PASSWORD':
						return message(form, { type: 'error', text: 'Outdated password' });
				}
			}
			console.error(e);
			return message(form, { type: 'error', text: 'Something went wront, please try again' });
		}

		return message(form, { type: 'success', text: 'Login sucessfull 😎' });
	}
};
