import type { PageServerLoad } from './$types';
import { callbacks, redirectFromPrivatePage } from '$lib/server/redirects/redirects';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { userSettingsSchema } from '$lib/schemas/userSettings';
import type { Message } from '$lib/schemas/message';
import { redirect } from 'sveltekit-flash-message/server';
import { updateUserInfo } from '$lib/server/drizzle/user/update';
import { stringToDate } from '$lib/date.ts/dateTransforms';
import { NewWishSchema, newUserInfoSchema } from '$lib/server/drizzle/schema';
import { DatabaseError } from '@planetscale/database';


export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate<typeof userSettingsSchema, Message>(userSettingsSchema),
		event.locals.auth.validate()
	]);

	const { userInfo, user } = await redirectFromPrivatePage(session, event);

	form.data.username = userInfo.username
	form.data.fullname = userInfo.fullname;
	form.data.birthdate = userInfo.birthdate.toISOString().slice(0, 10);

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
				username: form.data.username,
				birthdate: birthdate
			});
		} catch (e) {
			if (e instanceof DatabaseError) {
				if (e.body.message.includes('code = AlreadyExists')) {
					return setError(form, 'username', `The username \"${form.data.username}\" is Already taken`);
				}
			}
			console.error(e);
			return message(form, { type: 'error', text: 'Unknown error' });
		}

		return message(form, { type: 'success', text: 'Settings updated successfully' });
	}
};
