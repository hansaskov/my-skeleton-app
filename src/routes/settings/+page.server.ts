import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage, redirectToLogin } from '$lib/server/redirects';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, redirectToLogin(url));
	redirectFromPrivatePage(user);

	return {
		user
	};
};
