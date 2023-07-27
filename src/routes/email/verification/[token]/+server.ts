import { auth } from '$lib/server/lucia';
import { LuciaTokenError } from '@lucia-auth/tokens';
import type { RequestHandler } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { callbacks } from '$lib/server/redirects/redirects';
import { validateEmailVerificationToken } from '$lib/server/token';

export const GET: RequestHandler = async (event) => {
	const { token } = event.params;
	try {
		const userId = await validateEmailVerificationToken(token);
		const user = await auth.getUser(userId);

		await Promise.all([
			auth.invalidateAllUserSessions(user.userId),
			auth.updateUserAttributes(user.userId, { email_verified: true })
		]);

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		event.locals.auth.setSession(session);
	} catch (e) {
		if (e instanceof LuciaTokenError) {
			switch (e.message) {
				case 'EXPIRED_TOKEN':
					throw redirect(callbacks.email.invalid_token.page, callbacks.email.invalid_token, event);
				case 'INVALID_TOKEN':
					throw redirect(callbacks.email.invalid_token.page, callbacks.email.invalid_token, event);
			}
		}
		console.log(e)
	}

	throw redirect(callbacks.email.verified.page, callbacks.email.verified, event);
};
