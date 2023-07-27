import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects/redirects';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	return { userInfo, user };
};
