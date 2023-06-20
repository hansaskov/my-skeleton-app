import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user: authUser } = await locals.auth.validateUser();
	const { userInfo, user } = await redirectFromPrivatePage(authUser, url);

	return { userInfo, user };
};
