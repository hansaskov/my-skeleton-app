import { db } from '$lib/server/planetscale';

export const load = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	const { pathname } = url;

	if (!user) {
		return { pathname };
	}

	const userInfo = await db.query.userInfo.findFirst({
		where: (userInfo, { eq }) => eq(userInfo.userId, user.userId)
	});

	return {
		user,
		userInfo,
		pathname
	};
};
