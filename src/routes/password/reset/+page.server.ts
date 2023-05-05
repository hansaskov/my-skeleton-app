import { sendPasswordResetEmail } from '$lib/server/email';
import { auth, passwordResetToken } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

import { schema } from '$lib/schemas/authentication';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (user && user.userInfoSet == false) throw redirect(302, '/signup/setup');

	const form = await superValidate(schema.email);
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema.email);
		if (!form.valid) return fail(400, { form });

		try {
			const dbUser = await db.authUser.findFirst({
				where: {
					email: form.data.email
				}
			});
			if (!dbUser) {
				return setError(form, 'email', `E-mail "${form.data.email}" does not exist`);
			}
			const user = auth.transformDatabaseUser(dbUser);
			const token = await passwordResetToken.issue(user.userId);
			await sendPasswordResetEmail(user.email, token.toString());
		} catch (e) {
			console.error(e);
			return fail(400, { form, message: 'Unknown error' });
		}

		return { form };
	}
};
