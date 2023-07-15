import { db } from '$lib/server/planetscale';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();

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
};
