import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { emailVerificationToken } from '$lib/server/lucia';
import { sendVerificationEmail } from '$lib/server/email/send';

import type { Actions, PageServerLoad } from './$types';
import { callbacks } from '$lib/server/redirects/redirects';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.locals.auth.validateUser();

	if (!user) throw redirect(302, callbacks.login.page, callbacks.login, event);
	if (!user.userInfoSet)
		throw redirect(302, callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);
	if (!user.emailVerified) return { user };

	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const { user } = await locals.auth.validateUser();
		if (!user || user.emailVerified) {
			return fail(401, { message: 'Unauthorized' });
		}
		try {
			const token = await emailVerificationToken.issue(user.userId);
			await sendVerificationEmail(user, token.toString());
		} catch (e) {
			if (e instanceof PostmarkError && e.code == 429) {
				return fail(429, { message: e.message });
			}
			console.error(e);
			return fail(500, { message: 'An unknown error occurred' });
		}
	}
};
