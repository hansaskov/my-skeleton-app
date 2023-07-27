import type { PageServerLoad } from './$types';
import { redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { selectAllFamilyMembersFromUser } from '$lib/server/drizzle/family/select';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	try {
		const families = await selectAllFamilyMembersFromUser(user.userId);
		return { userInfo, user, families };
	} catch (e) {
		console.error(e);
	}

	return { userInfo, user };
};
