import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects';

export const load: PageServerLoad = async (event) => {
	const { user: authUser } = await event.locals.auth.validateUser();
	const { userInfo, user } = await redirectFromPrivatePage(authUser, event);

	return { userInfo, user };
};
