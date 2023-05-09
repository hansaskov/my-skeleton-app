import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects';

export const load: PageServerLoad = async ({ locals, url }) => {
	let { user } = await locals.auth.validateUser();
	user = redirectFromPrivatePage(user, url);

	return {
		user
	};
};
