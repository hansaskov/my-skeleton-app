import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth, emailVerificationToken } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { sendVerificationEmail } from '$lib/server/email/send';
import { schema } from '$lib/schemas/authentication';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	// Use Promise.all to await both promises simultaneously
	const [form, { user }] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validateUser()
	]);

	if (!user) return { form };

	handleSignedinRedirect(user, event);
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema.signup);
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
			await sendVerificationEmail(user, token.toString());

			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'email', `E-mail "${form.data.email}" already in use`);
			}
			if (e instanceof PostmarkError && e.code == 429) {
				return setError(form, 'Rate Limit Exceeded');
			}

			console.error(e);
			return setError(form, 'Unknown error has occured');
		}

		return { form };
	}
};
