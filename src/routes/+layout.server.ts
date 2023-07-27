import { getUserInfo } from '$lib/server/drizzle/userinfo/select';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const session = await event.locals.auth.validate();

	if (!session) {
		return;
	}

	const userInfo = await getUserInfo(session.user.userId);

	return {
		user: session.user,
		userInfo
	};
});
