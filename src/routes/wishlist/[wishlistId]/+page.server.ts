import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';
import {
	selectRoleforWishOnUser,
	selectRoleforWishlistOnUser,
	selectWishlistsOnId
} from '$lib/server/drizzle/wishlist/seletc';
import { NewWishSchema } from '$lib/server/drizzle/schema';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Message } from '$lib/schemas/message';
import { fail } from '@sveltejs/kit';
import { createWish } from '$lib/server/drizzle/wish/insert';
import { deleteWishSchema } from '$lib/schemas/wishlist';
import { deleteWish } from '$lib/server/drizzle/wish/delete';

export const load: PageServerLoad = async (event) => {
	const [createForm, deleteForm, session] = await Promise.all([
		superValidate(NewWishSchema),
		superValidate(deleteWishSchema),
		event.locals.auth.validate()
	]);

	const { userInfo } = await redirectFromPrivatePage(session, event);

	const wishlist = await selectWishlistsOnId(event.params.wishlistId);

	if (!wishlist) {
		const fMessage = {
			type: 'error',
			message: 'Wishlist not found',
			page: `/wishlist`
		} as const;

		throw redirect(fMessage.page, fMessage, event);
	}

	createForm.data.wishlistId = wishlist.id;

	return { userInfo, wishlist, createForm, deleteForm };
};

export const actions = {
	// Delete wishlist on user
	delete: async (event) => {
		// Validate session
		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		// Validate form data
		const form = await superValidate(event.request, deleteWishSchema);
		if (!form.valid) return fail(400, { form });

		// Verify user permissions
		const role = await selectRoleforWishOnUser({
			userId: session.user.userId,
			wishId: form.data.wishId
		});

		if (!role || role.wishlistRole !== 'EDITABLE') {
			return message(form, {
				type: 'error',
				text: 'User not authenticated to delete wish'
			});
		}

		// Delete new wish
		try {
			await deleteWish(form.data);
		} catch (e) {
			console.log(e);
			return message(form, {
				type: 'error',
				text: 'Something went wrong, please try again'
			});
		}

		return message(form, {
			type: 'success',
			text: `Wish removed 😎`
		});
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
