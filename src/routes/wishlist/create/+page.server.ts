import type { Actions, PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { wishlistSchema } from '$lib/schemas/wishlist';
import { createWishlist } from '$lib/server/drizzle/wishlist/insert';
import { getUserInfo } from '$lib/server/drizzle/user/select';
import { selectWishlistOnNameAndUserId } from '$lib/server/drizzle/wishlist/seletc';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(wishlistSchema),
		event.locals.auth.validate()
	]);

	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	return { userInfo, user, form };
};

export const actions: Actions = {
	default: async (event) => {
		const [form, session] = await Promise.all([
			superValidate(event.request, wishlistSchema),
			event.locals.auth.validate()
		]);
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		let wishlistId = '';


		// Validate that the wishlist is unique for that username
		const wishlist =  await selectWishlistOnNameAndUserId({userId: session.user.userId, wishlistName: form.data.name})

		if (wishlist) {
			return setError(form, 'name', `The wishlist name ${form.data.name} is already in use. Try another` )
		}

		try {
			wishlistId = await createWishlist(form.data, session.user.userId);
		} catch (e) {
			console.error(e);
			return setError(form, 'Something went wront, please try again');
		}

		const userInfo = await getUserInfo(session.user.userId)

		if (userInfo) {
			const fMessage = {
				type: 'success',
				message: 'Wishlist created 😎',
				page: `/${userInfo.username}/${form.data.name}`
			} as const;
	
			throw redirect(fMessage.page, fMessage, event);
		} else {
			const fMessage = {
				type: 'success',
				message: 'Wishlist created 😎',
				page: `/wishlist`
			} as const;
	
			throw redirect(fMessage.page, fMessage, event);
		}
	}
};
