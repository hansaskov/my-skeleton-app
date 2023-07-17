// src/routes/password-reset/[token]/+page.server.ts
// page to enter new password
import { LuciaTokenError } from '@lucia-auth/tokens';
import { auth, passwordResetToken } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { schema } from '$lib/schemas/authentication';
import { redirect } from 'sveltekit-flash-message/server';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';

export const load: PageServerLoad = async (event) => {
	const [form, { user }] = await Promise.all([
		superValidate(schema.password),
		event.locals.auth.validateUser()
	]);
	if (!user) return { form };

	handleSignedinRedirect(user, event);
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const form = await superValidate(request, schema.password);
		if (!form.valid) return fail(400, { form });

		try {
			const token = await passwordResetToken.validate(params.token ?? '');
			const user = await auth.getUser(token.userId);
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, form.data.password);
			const session = await auth.createSession(user.userId);
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
