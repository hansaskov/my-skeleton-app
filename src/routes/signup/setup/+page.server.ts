import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

const schema = z.object({
	full_name: z.string(),
	birthdate: z.date(),
	description: z.string()
});

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	// If the user exists, redirect authenticated users to the profile page.
	if (!user) throw redirect(302, '/login');
	// If the user is missing userdata keep them on the page
	if (user.userInfoSet == false) {
		const form = await superValidate(schema);
		return { form };
	}
	// Is their email is not verified, redirect to the email verification otherwise redirect to the home page
	if (!user.emailVerified) {
		throw redirect(302, '/email/verification');
	} else {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		try {
			await db.userInfo.create({
				data: {
					full_name: form.data.full_name,
					birthdate: form.data.birthdate,
					description: form.data.description,
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
