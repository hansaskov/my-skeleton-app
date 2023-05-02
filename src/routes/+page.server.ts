import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');
	if (user.userInfoSet == false) throw redirect(302, '/signup/setup');
	if (user.emailVerified == false) {
		throw redirect(302, '/email/verification');
	}

	return {
		user
	};
};
