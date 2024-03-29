import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import type { PageServerLoad } from './$types';
import { sendVerificationEmail } from '$lib/server/email/send';
import { schema } from '$lib/schemas/authentication';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';
import type { Message } from '$lib/schemas/message';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	// Use Promise.all to await both promises simultaneously
	const [form, session] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validate()
	]);

	if (!session) return { form };

	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate<typeof schema.signup, Message>(request, schema.signup);
		if (!form.valid) return fail(400, { form });

		try {
			const user = await auth.createUser({
				key: {
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
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);

			await sendVerificationEmail(user);
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			}
			if (e instanceof PostmarkError && e.code == 429) {
				return message(form, { type: 'error', text: 'Rate Limit Exceeded' });
			}

			console.error(e);
			return message(form, { type: 'error', text: 'Unknown error has occured' });
		}

		return message(form, { type: 'success', text: 'Signup completed 😎' });
	}
};
