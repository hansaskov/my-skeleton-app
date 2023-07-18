import { getUserInfo } from '$lib/server/drizzle/userinfo/select';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { user } = await event.locals.auth.validateUser();

	if (!user) {
		return;
	}

	const userInfo = await getUserInfo(user.userId);

	return {
		user,
		userInfo
	};
});
