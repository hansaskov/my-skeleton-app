import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { callbacks, createCallbackUrl, getCallbackUrl } from '$lib/server/redirects';
import { moveFileFromTempFolder, renameObjectKey } from '../../api/upload/server/renameFile';
import { db } from '$lib/server/planetscale';
import { userInfo } from '$lib/schemas/drizzle/schema';
import { generateRandomString } from 'lucia-auth';

const schema = z.object({
	fullname: z.string(),
	birthdate: z.date(),
	description: z.string(),
	imageUrl: z.string().nullish()
});

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.auth.validateUser();

	// If the user is not logged in, return them to login page
	if (!user) throw redirect(302, createCallbackUrl(callbacks.login, url));

	// If the user is missing userdata keep them on the page
	if (!user.userInfoSet) {
		const form = await superValidate(schema);
		const message = url.searchParams.get('message');
		return { form, message };
	}
	// Is their email is not verified, redirect to the email verification otherwise redirect to the home page
	if (!user.emailVerified) throw redirect(302, createCallbackUrl(callbacks.email, url));

	// If all is well, go to the callback url or home if it does not exist
	throw redirect(302, getCallbackUrl(url));
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
