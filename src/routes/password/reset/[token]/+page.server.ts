// src/routes/password-reset/[token]/+page.server.ts
// page to enter new password
import { LuciaTokenError } from '@lucia-auth/tokens';
import { auth } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { schema } from '$lib/schemas/authentication';
import { redirect } from 'sveltekit-flash-message/server';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { validatePasswordResetToken } from '$lib/server/token';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validate()
	]);
	if (!session) return { form };

	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const form = await superValidate(request, schema.password);
		if (!form.valid) return fail(400, { form });

		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			let user = await auth.getUser(userId);
			await auth.invalidateAllUserSessions(userId);
			await auth.updateKeyPassword('email', user.email, form.data.password);

			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true,
				});
			}

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaTokenError) {
				switch (e.message) {
					case 'EXPIRED_TOKEN':
						return setError(form, 'Your password reset link has expired');
					case 'INVALID_TOKEN':
						return setError(form, 'Your password reset link is invalid');
				}
			}

			console.error(e);
			return setError(form, 'Unknown Error');
		}

		throw redirect(303, '/');
	}
};
