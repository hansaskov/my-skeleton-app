import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage, createCallbackUrl } from '$lib/server/redirects';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	let { user } = await locals.auth.validateUser();
	user = redirectFromPrivatePage(user, url)

	const userInfo = await db.userInfo.findUnique({
		where: {
			userId: user.userId
		}
	});

	if (!userInfo) return fail(404, { message: 'User not found' });

	return { userInfo, user };
};
