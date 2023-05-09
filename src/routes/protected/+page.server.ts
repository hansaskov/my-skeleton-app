import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage, redirectToLogin } from '$lib/server/redirects';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, redirectToLogin(url));
	redirectFromPrivatePage(user);

	const userInfo = await db.userInfo.findUnique({
		where: {
			userId: user.userId
		}
	});

	if (!userInfo) return fail(404, { message: 'User not found' });

	return { userInfo, user };
};
