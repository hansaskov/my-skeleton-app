import { fail, redirect } from '@sveltejs/kit';
import { emailVerificationToken } from '$lib/server/lucia';
import { sendEmailVerificationEmail } from '$lib/server/email';

import type { Actions, PageServerLoad } from './$types';
import { callbacks, createCallbackUrl, getCallbackUrl } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();

	// If the user is not logged in, return them to login page
	if (!user) throw redirect(302, createCallbackUrl(callbacks.login, url));
	if (!user.userInfoSet) throw redirect(302, createCallbackUrl(callbacks.setup, url));
	if (!user.emailVerified) {
		const message = url.searchParams.get('message');
		return { user, message };
	}

	throw redirect(302, getCallbackUrl(url));
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const { user } = await locals.auth.validateUser();
		if (!user || user.emailVerified) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}
		try {
			const token = await emailVerificationToken.issue(user.userId);
			await sendEmailVerificationEmail(user.email, token.toString());
		} catch (e) {
			console.error(e);
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
