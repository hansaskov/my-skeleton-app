import type { Actions, PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { familySchema } from '$lib/schemas/family';
import { redirect } from 'sveltekit-flash-message/server';
import { createNewFamily } from '$lib/server/drizzle/family/insert';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(familySchema),
		event.locals.auth.validate()
	]);

	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	return { userInfo, user, form };
};

export const actions: Actions = {
	default: async (event) => {
		const [form, session] = await Promise.all([
			superValidate(event.request, familySchema),
			event.locals.auth.validate()
		]);
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		try {
			await createNewFamily(form.data, session.user.userId);
		} catch (e) {
			console.error(e);
			return setError(form, 'Something went wront, please try again');
		}

		throw redirect(callbacks.family.created.page, callbacks.family.created, event);
	}
};
