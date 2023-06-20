import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
import { callbacks, createCallbackUrl, getCallbackUrl } from '$lib/server/redirects';
import { renameObjectKey } from '../../api/upload/server/renameFile';

const schema = z.object({
	full_name: z.string(),
	birthdate: z.date(),
	description: z.string(),
	image_url: z.string().nullish()
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

	throw redirect(302, getCallbackUrl(url));
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const prefix = 'temp/';
		if (form.data.image_url && !form.data.image_url.startsWith(prefix)) {
			return fail(400, {
				form,
				message: `The file ${form.data.image_url} is not uploaded to the temp folder`
			});
		}

		try {
			// Move the file away from the temp storage for it to become persistant.
			if (form.data.image_url) {
				const oldKey = form.data.image_url;
				const newKey = form.data.image_url.substring(prefix.length);
				await renameObjectKey(oldKey, newKey);
				form.data.image_url = `https://image.hjemmet.net/${newKey}`;
			}

			// Create the user info inside sequel db
			await db.userInfo.create({
				data: {
					full_name: form.data.full_name,
					birthdate: form.data.birthdate,
					description: form.data.description,
					image_url: form.data.image_url,
					userId: session.userId
				}
			});

			await auth.updateUserAttributes(session.userId, {
				user_info_set: true
			});
		} catch (e) {
			console.error(e);
			return fail(400, { form, message: 'Unknown error' });
		}

		return { form };
	}
};
