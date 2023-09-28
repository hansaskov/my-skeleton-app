import type { PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { userSettingsSchema } from '$lib/schemas/userSettings';
import type { Message } from '$lib/schemas/message';
import { redirect } from 'sveltekit-flash-message/server';
import { updateUserInfo } from '$lib/server/drizzle/user/update';
import { stringToDate } from '$lib/date.ts/dateTransforms';

export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate<typeof userSettingsSchema, Message>(userSettingsSchema),
		event.locals.auth.validate()
	]);

	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	form.data.birthdate = userInfo.birthdate.toISOString().slice(0, 10);
	form.data.fullname = userInfo.fullname;

	return { form, userInfo, user };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, userSettingsSchema);
		if (!form.valid) return { status: 400, response: { form } };

		const session = await event.locals.auth.validate();
		if (!session) throw redirect(callbacks.login.page, callbacks.login, event);

		const birthdate = stringToDate(form.data.birthdate);
		if (!birthdate) return setError(form, 'birthdate', 'Invalid date');

		try {
			await updateUserInfo({
				userId: session.user.userId,
				fullname: form.data.fullname,
				birthdate: birthdate
			});
		} catch (e) {
			console.error(e);
			message(form, { type: 'error', text: 'Unknown error' });
		}

		return message(form, { type: 'success', text: 'Settings updated successfully' });
	}
};
