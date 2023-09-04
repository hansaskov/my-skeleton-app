import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { sendVerificationEmail } from '$lib/server/email/send';

import type { Actions, PageServerLoad } from './$types';
import { callbacks } from '$lib/server/redirects/redirects';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();

	if (!session) throw redirect(302, callbacks.login.page, callbacks.login, event);
	if (!session.user.userInfoSet)
		throw redirect(302, callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);
	if (!session.user.emailVerified) return { user: session.user };

	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		if (session.user.emailVerified) {
			throw redirect(302, '/');
		}
		try {
			await sendVerificationEmail(session.user);
		} catch (e) {
			if (e instanceof PostmarkError && e.code == 429) {
				return fail(429, { message: e.message });
			}
			console.error(e);
			return fail(500, { message: 'An unknown error occurred' });
		}
	}
};
