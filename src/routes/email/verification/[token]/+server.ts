import { auth, emailVerificationToken } from '$lib/server/lucia';
import { LuciaTokenError } from '@lucia-auth/tokens';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	const tokenParams = params.token;
	try {
		const token = await emailVerificationToken.validate(tokenParams);
		await auth.invalidateAllUserSessions(token.userId);
		await auth.updateUserAttributes(token.userId, {
			email_verified: true
		});
		const session = await auth.createSession(token.userId);
		locals.auth.setSession(session);
	} catch (e) {
		if (e instanceof LuciaTokenError && e.message === 'EXPIRED_TOKEN') {
			// expired token/link
			return new Response(null, {
				status: 401
			});
		}
		if (e instanceof LuciaTokenError && e.message === 'INVALID_TOKEN') {
			// invalid link
			return new Response(null, {
				status: 401
			});
		}
	}
	throw redirect(302, '/');
};
