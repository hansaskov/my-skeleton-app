import { sendPasswordResetEmail } from '$lib/server/email/send';
import { auth, passwordResetToken } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

import { schema } from '$lib/schemas/authentication';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';
import { db } from '$lib/server/planetscale';
import { handleSignedinRedirect } from '$lib/server/redirects';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	const [form, { user }] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validateUser()
	]);

	if (!user) return { form };
	handleSignedinRedirect(user, event);
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema.email);
		if (!form.valid) return fail(400, { form });

		try {
			const dbUser = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.email, form.data.email)
			});

			if (!dbUser) {
				return setError(form, 'email', `E-mail "${form.data.email}" does not exist`);
			}
			const user = auth.transformDatabaseUser({
				id: dbUser.id,
				email: dbUser.email,
				email_verified: dbUser.isEmailVerified,
				user_info_set: dbUser.isUserInfoSet
			});

			const token = await passwordResetToken.issue(user.userId);
			await sendPasswordResetEmail(user, token.toString());
		} catch (e) {
			if (e instanceof PostmarkError && e.code == 429) {
				return setError(form, 'Rate Limit Exceeded');
			}

			console.error(e);
			return setError(form, 'Unknown error');
		}

		return { form };
	}
};
