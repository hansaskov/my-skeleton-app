import { redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import type { PageServerLoad } from './$types';
import { selectWishlistsOnUser } from '$lib/server/drizzle/wishlist/seletc';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();
	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	// Get all wishlists and preview them.
	const wishlists = await selectWishlistsOnUser(user.userId);

	return { userInfo, wishlists };
};
