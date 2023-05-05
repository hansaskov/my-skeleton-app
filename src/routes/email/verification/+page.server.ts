import { fail, redirect } from '@sveltejs/kit';
import { emailVerificationToken } from '$lib/server/lucia';
import { sendEmailVerificationEmail } from '$lib/server/email';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	if (!user) {
		throw redirect(302, '/login');
	}
	if (user.emailVerified) {
		throw redirect(302, '/');
	}
	return {
		user
	};
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
