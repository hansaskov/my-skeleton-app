import { db } from '$lib/server/planetscale';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { user } = await event.locals.auth.validateUser();

	if (!user) {
		return;
	}

	const userInfo = await db.query.userInfo.findFirst({
		where: (userInfo, { eq }) => eq(userInfo.userId, user.userId)
	});

	return {
		user,
		userInfo
	};
});
