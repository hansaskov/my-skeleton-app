import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { callbacks } from '$lib/server/redirects/redirects';
import { moveFileFromTempFolder } from '../../api/upload/server/renameFile';
import { userInfo } from '$lib/server/drizzle/schema';
import { generateRandomString } from 'lucia-auth';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/drizzle/db';

const schema = z.object({
	fullname: z.string(),
	birthdate: z.date(),
	description: z.string(),
	imageUrl: z.string().nullish()
});

export const load: PageServerLoad = async (event) => {
	const { user } = await event.locals.auth.validateUser();

	// If the user is not logged in, return them to login page
	if (!user) throw redirect(302, callbacks.login.page, callbacks.login, event);

	// If the user is missing userdata keep them on the page
	if (!user.userInfoSet) {
		const form = await superValidate(schema);
		return { form };
	}
	// Is their email is not verified, redirect to the email verification otherwise redirect to the home page
	if (!user.emailVerified)
		throw redirect(302, callbacks.setup.email.page, callbacks.setup.email, event);

	// If all is well, go to the homepage
	throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		try {
			// Move the file away from the temp storage for it to become persistant.
			if (form.data.imageUrl) {
				form.data.imageUrl = await moveFileFromTempFolder(form.data.imageUrl);
			}

			// Create the user info
			await db.insert(userInfo).values({
				id: generateRandomString(255),
				fullname: form.data.fullname,
				birthdate: form.data.birthdate,
				description: form.data.description,
				imageUrl: form.data.imageUrl,
				userId: session.userId
			});

			await auth.updateUserAttributes(session.userId, {
				user_info_set: true
			});
		} catch (e) {
			console.error(e);
			return setError(form, 'Unknown error');
		}

		return { form };
	}
};
