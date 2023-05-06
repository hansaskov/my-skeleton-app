import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { redirectToLogin } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, redirectToLogin(url));
	if (!user.userInfoSet) throw redirect(302, '/signup/setup');
	if (!user.emailVerified) throw redirect(302, '/email/verification');

	return {
		user
	};
};
