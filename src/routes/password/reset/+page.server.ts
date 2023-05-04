import { sendPasswordResetEmail } from '$lib/server/email';
import { auth, passwordResetToken } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

const schema = z.object({
	email: z.string().trim().min(1).max(255).email()
});

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (user && user.userInfoSet == false) throw redirect(302, '/signup/setup');

	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);
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
		} catch (error) {
			console.error(error);
			return fail(400, { form, message: 'Unknown error' });
		}

		return { form };
	}
};
