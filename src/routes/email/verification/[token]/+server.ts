import { auth, emailVerificationToken } from '$lib/server/lucia';
import { LuciaTokenError } from '@lucia-auth/tokens';
import type { RequestHandler } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { callbacks } from '$lib/server/redirects/redirects';

export const GET: RequestHandler = async (event) => {
	const tokenParams = event.params.token;
	try {
		const token = await emailVerificationToken.validate(tokenParams);
		await Promise.all([
			auth.invalidateAllUserSessions(token.userId),
			auth.updateUserAttributes(token.userId, { email_verified: true })
		]);

		const session = await auth.createSession(token.userId);
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
	}

	throw redirect(callbacks.email.verified.page, callbacks.email.verified, event);
};
