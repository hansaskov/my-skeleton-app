import type { Actions, PageServerLoad } from './$types';
import {
	callbacks,
	handleSignedinRedirect,
	redirectFromPrivatePage
} from '$lib/server/redirects/redirects';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { schema } from '$lib/schemas/authentication';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { createNewFamily } from '$lib/server/drizzle/family/insert';

export const load: PageServerLoad = async (event) => {
	const [form, { user: authUser }] = await Promise.all([
		superValidate(schema.family),
		event.locals.auth.validateUser()
	]);
	const { userInfo, user } = await redirectFromPrivatePage(authUser, event);

	return { userInfo, user, form };
};

export const actions: Actions = {
	default: async (event) => {
		const [form, { user }] = await Promise.all([
			superValidate(event.request, schema.family),
			event.locals.auth.validateUser()
		]);
		if (!user) throw redirect(callbacks.login.page, callbacks.login, event);

		try {
			await createNewFamily(form.data, user.userId);
		} catch (e) {
			console.error(e);
			return setError(form, 'Something went wront, please try again');
		}

		throw redirect(callbacks.family.created.page, callbacks.family.created, event);
	}
};
