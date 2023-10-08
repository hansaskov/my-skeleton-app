import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { callbacks } from '$lib/server/redirects/redirects';
import { moveFileFromTempFolder } from '../../api/upload/server/renameFile';
import { newUserInfoSchema, userInfo } from '$lib/server/drizzle/schema';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/drizzle/db';
import { DatabaseError } from '@planetscale/database';

const schema = newUserInfoSchema.omit({userId: true})


export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth.validate();

	// If the user is not logged in, return them to login page
	if (!session) throw redirect(302, callbacks.login.page, callbacks.login, event);

	// If the user is missing userdata keep them on the page
	if (!session.user.userInfoSet) {
		const form = await superValidate(schema);
		return { form };
	}
	// Is their email is not verified, redirect to the email verification otherwise redirect to the home page
	if (!session.user.emailVerified)
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
			// Move the image file away from the temp storage for it to become persistant.
			if (form.data.imageUrl) {
				form.data.imageUrl = await moveFileFromTempFolder(form.data.imageUrl);
			}
			// Create the user info
			await db.insert(userInfo).values({
				username: form.data.username,
				fullname: form.data.fullname,
				birthdate: form.data.birthdate,
				imageUrl: form.data.imageUrl,
				userId: session.user.userId
			});

			// Update user attributes
			await auth.updateUserAttributes(session.user.userId, {
				user_info_set: true
			});

		} catch (e) {
			// Throw error if username already exist. 
			if (e instanceof DatabaseError) {
				if (e.body.message.includes('code = AlreadyExists')) {
					return setError(form, 'username', `The username \"${form.data.username}\" is Already taken`);
				}
			}

			console.error(e);
			return setError(form, 'Unknown error');
		}

		return { form };
	}
};
