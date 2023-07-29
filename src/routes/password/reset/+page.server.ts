import { sendPasswordResetEmail } from '$lib/server/email/send';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/schemas/authentication';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { generateToken } from '$lib/server/token';
import { db } from '$lib/server/drizzle/db';
import { user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate(schema.login),
		event.locals.auth.validate()
	]);
	if (!session) return { form };
	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema.email);
		if (!form.valid) return fail(400, { form });

		try {
			const data = await db.select().from(user).where(eq(user.email, form.data.email));
			const storedUser = data.at(0);

			if (!storedUser) {
				return setError(form, 'email', `E-mail "${form.data.email}" does not exist`);
			}

			const token = await generateToken({ userId: storedUser.id, tokenType: 'PASSWORD RESET' });
			await sendPasswordResetEmail(
				{
					userId: storedUser.id,
					email: storedUser.email,
					emailVerified: storedUser.isEmailVerified,
					userInfoSet: storedUser.isUserInfoSet
				},
				token.toString()
			);
		} catch (e) {
			if (e instanceof PostmarkError && e.code == 429) {
				return setError(form, e.message);
			}

			console.error(e);
			return setError(form, 'Unknown error');
		}

		return { form };
	}
};
