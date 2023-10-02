import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import {
	selectRoleforWishlistOnUser,
	selectWishlistsOnId
} from '$lib/server/drizzle/wishlist/seletc';
import { NewWishSchema } from '$lib/server/drizzle/schema';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Message } from '$lib/schemas/message';
import { fail } from '@sveltejs/kit';
import { createWishlist } from '$lib/server/drizzle/wishlist/insert';
import { createWish } from '$lib/server/drizzle/wish/insert';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(NewWishSchema),
		event.locals.auth.validate()
	]);

	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	const wishlist = await selectWishlistsOnId(event.params.wishlistId);

	if (!wishlist) {
		const fMessage = {
			type: 'error',
			message: 'Wishlist not found',
			page: `/wishlist`
		} as const;

		throw redirect(fMessage.page, fMessage, event);
	}

	form.data.wishlistId = wishlist.id;

	return { userInfo, wishlist, form };
};

export const actions = {
	// Delete wishlist on user
	delete: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		return;
	},
	// Create wish on wishlist
	create: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		// Validate form
		const form = await superValidate<typeof NewWishSchema, Message>(event.request, NewWishSchema);
		if (!form.valid) return fail(400, { form });

		// Validate that the user can edit
		const wishlistRole = await selectRoleforWishlistOnUser({
			userId: session.user.userId,
			wishlistId: event.params.wishlistId
		});

		if (!wishlistRole || wishlistRole.wishlistRole !== 'EDITABLE') {
			return message(form, {
				type: 'error',
				text: 'User not authenticated to create wish'
			});
		}

		// Create new wish

		try {
			await createWish(form.data);
		} catch (e) {
			console.log(e);
			return message(form, {
				type: 'error',
				text: 'Something went wrong, please try again'
			});
		}

		return message(form, {
			type: 'success',
			text: `${form.data.name} created 😎`
		});
	}
} satisfies Actions;
