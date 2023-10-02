import type { Actions, PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { wishlistSchema } from '$lib/schemas/wishlist';
import { createWishlist } from '$lib/server/drizzle/wishlist/insert';

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

		try {
			wishlistId = await createWishlist(form.data, session.user.userId);
		} catch (e) {
			console.error(e);
			return setError(form, 'Something went wront, please try again');
		}

		const fMessage = {
			type: 'success',
			message: 'Wishlist created 😎',
			page: `/wishlist/${wishlistId}`
		} as const;

		throw redirect(fMessage.page, fMessage, event);
	}
};
