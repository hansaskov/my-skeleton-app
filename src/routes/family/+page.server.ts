import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import {
	selectAllFamilyMembersFromUser,
	selectFamilyOnUsers,
	selectUsersOnFamily
} from '$lib/server/drizzle/family/select';

export const load: PageServerLoad = async (event) => {
	const { user: authUser } = await event.locals.auth.validateUser();
	const { userInfo, user } = await redirectFromPrivatePage(authUser, event);

	try {
		const families = await selectAllFamilyMembersFromUser(user.userId);
		return { userInfo, user, families };
	} catch (e) {
		console.error(e);
	}

	return { userInfo, user };
};
