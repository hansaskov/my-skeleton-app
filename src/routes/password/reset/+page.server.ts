import { sendPasswordResetEmail } from '$lib/server/email/send';
import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/schemas/authentication';
import { PostmarkError } from 'postmark/dist/client/errors/Errors';
import { handleSignedinRedirect } from '$lib/server/redirects/redirects';
import { generateToken } from '$lib/server/token';
import { db } from '$lib/server/drizzle/db';
import { user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { Message } from '$lib/schemas/message';


// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async (event) => {
	const [form, session] = await Promise.all([
		superValidate<typeof schema.email, Message>(event, schema.email),
		event.locals.auth.validate()
	]);
	if (!session) return { form };
	handleSignedinRedirect(session.user, event);
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate<typeof schema.email, Message>(event, schema.email);
		if (!form.valid) return fail(400, { form });
		

		try {
			const data = await db.select().from(user).where(eq(user.email, form.data.email));
			const storedUser = data.at(0);

			if (!storedUser) {
				return message(form, {type: "error", text: `E-mail "${form.data.email}" does not exist`});
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
				return message(form, {type: 'error', text: e.message});
			}

			console.error(e);
			return message(form, {type: 'error', text: 'Unknown error'});
		}

		return message(form, {type: 'success', text: 'Password reset sent'});
	}
};
