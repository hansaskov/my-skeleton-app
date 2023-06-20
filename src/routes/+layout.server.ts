import { db } from '$lib/server/db';

export const load = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	const { pathname } = url;

	if (!user) {
		return { pathname };
	}

	const userInfo = await db.userInfo.findUnique({
		where: {
			userId: user.userId
		}
	});

	return {
		user,
		userInfo,
		pathname
	};
};
