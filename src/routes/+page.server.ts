import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();
	redirectFromPrivatePage(user, url);

	return {
		user
	};
};
