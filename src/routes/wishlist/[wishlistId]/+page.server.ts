import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import type { Message } from '$lib/schemas/message';
import { NewWishSchema, UpdateWishSchema } from '$lib/server/drizzle/schema';
import { createWish } from '$lib/server/drizzle/wish/insert';
import { deleteWish } from '$lib/server/drizzle/wish/delete';
import { updateWish } from '$lib/server/drizzle/wish/update';
import { deleteWishSchema } from '$lib/schemas/wishlist';
import {
	selectRoleforWishOnUser,
	selectRoleforWishlistOnUser,
	selectWishlistsOnId
} from '$lib/server/drizzle/wishlist/seletc';

async function validateSession(event: RequestEvent) {
	const session = await event.locals.auth.validate();
	if (!session) throw redirect(callbacks.login.page, callbacks.login, event);
	return session;
}

function redirectHelper(page: string, Message: Message, event: RequestEvent): never {
	throw redirect(page, { type: Message.type, message: Message.text, page: page} as const , event);
}


export const load: PageServerLoad = async (event) => {
    // 1. Validate session and forms
    const [createForm, deleteForm, session] = await Promise.all([
        superValidate(NewWishSchema),
        superValidate(deleteWishSchema),
        event.locals.auth.validate()
    ]);

    // 2. Fetch the wishlist
    const wishlist = await selectWishlistsOnId(event.params.wishlistId);
    if (!wishlist) {
        redirectHelper('/wishlist', { type: 'error', text: 'Wishlist not found' }, event);
    }

    // 3. Determine user role
    let userRole 
    if (session) {
        userRole = await selectRoleforWishlistOnUser({
            userId: session.user.userId,
            wishlistId: event.params.wishlistId
        });
    }

    // 4. Check for access permissions
    if (!wishlist.is_public && !userRole) {
        throw redirect(callbacks.login.page, callbacks.login, event);
    }

	const wishlistRole = userRole?.wishlistRole || 'VIEWABLE' 

    // 5. Set the wishlist ID for the create form
    createForm.data.wishlistId = wishlist.id;

    return { wishlistRole, wishlist, createForm, deleteForm };
};


export const actions = {
	delete: async (event) => {
		const session = await validateSession(event);
		const form = await superValidate(event.request, deleteWishSchema);
		if (!form.valid) return fail(400, { form });

		const role = await selectRoleforWishOnUser({
			userId: session.user.userId,
			wishId: form.data.wishId
		});

		if (!role || role.wishlistRole !== 'EDITABLE') {
			return message(form, { type: 'error', text: 'User not authenticated to delete wish' });
		}

		try {
			await deleteWish(form.data);
		} catch (e) {
			console.error(e);
			return message(form, { type: 'error', text: 'Something went wrong, please try again' });
		}

		return message(form, { type: 'success', text: `Wish removed 😎` });
	},

	create: async (event) => {
		const session = await validateSession(event);
		const form = await superValidate<typeof NewWishSchema, Message>(event.request, NewWishSchema);
		if (!form.valid) return fail(400, { form });

		const wishlistRole = await selectRoleforWishlistOnUser({
			userId: session.user.userId,
			wishlistId: event.params.wishlistId
		});

		if (!wishlistRole || wishlistRole.wishlistRole !== 'EDITABLE') {
			return message(form, { type: 'error', text: 'User not authenticated to create wish' });
		}

		try {
			await createWish(form.data);
		} catch (e) {
			console.error(e);
			return message(form, { type: 'error', text: 'Something went wrong, please try again' });
		}

		return message(form, { type: 'success', text: `${form.data.name} created 😎` });
	},

	update: async (event) => {
		const session = await validateSession(event);
		const form = await superValidate<typeof UpdateWishSchema, Message>(event.request, UpdateWishSchema);
		if (!form.valid) return fail(400, { form });

		const wishlistRole = await selectRoleforWishlistOnUser({
			userId: session.user.userId,
			wishlistId: event.params.wishlistId
		});

		if (!wishlistRole || wishlistRole.wishlistRole !== 'EDITABLE') {
			return message(form, { type: 'error', text: 'User not authenticated to update wish' });
		}

		try {
			await updateWish(form.data);
		} catch (e) {
			console.error(e);
			return message(form, { type: 'error', text: 'Something went wrong, please try again' });
		}

		return message(form, { type: 'success', text: `${form.data.name} updated 😎` });
	}
} satisfies Actions;
