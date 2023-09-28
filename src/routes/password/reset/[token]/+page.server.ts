// src/routes/password-reset/[token]/+page.server.ts
// page to enter new password
import { auth } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { schema } from '$lib/schemas/authentication';
import { redirect } from 'sveltekit-flash-message/server';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { TokenError, validateToken } from '$lib/server/token';
import type { Message } from '$lib/schemas/message';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate<typeof schema.password, Message>(event, schema.password),
		event.locals.auth.validate()
	]);
	if (!session) return { form };

	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const form = await superValidate<typeof schema.password, Message>(request, schema.password);
		if (!form.valid) return fail(400, { form });

		try {
			const { token } = params;
			const userId = await validateToken({ tokenId: token });
			let user = await auth.getUser(userId);
			await auth.invalidateAllUserSessions(userId);
			await auth.updateKeyPassword('email', user.email, form.data.password);

			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true
				});
			}

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof TokenError) {
				switch (e.cause) {
					case 'EXPIRED_TOKEN':
						return message(form, { type: 'error', text: 'Your password reset link has expired' });
					case 'INVALID_TOKEN':
						return message(form, { type: 'error', text: 'Your password reset link is invalid' });
				}
			}

			console.error(e);
			return message(form, { type: 'error', text: 'Invalid Error' });
		}

		throw redirect(303, '/');
	}
};
