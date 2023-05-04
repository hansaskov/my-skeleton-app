// src/routes/password-reset/[token]/+page.server.ts
// page to enter new password
import { LuciaTokenError } from '@lucia-auth/tokens';
import { auth, passwordResetToken } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

function containsNumber(str: string) {
	return Array.from(str).some((c) => c >= '0' && c <= '9');
}

const schema = z.object({
	password: z
		.string()
		.min(8)
		.max(255)
		.refine(containsNumber, { message: 'Password must contain at least one number' })
});

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (user && user.userInfoSet == false) throw redirect(302, '/signup/setup');

	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		try {
			const token = await passwordResetToken.validate(params.token ?? '');
			const user = await auth.getUser(token.userId);
			await auth.invalidateAllUserSessions(user.userId);
			// update key
			await auth.updateKeyPassword('email', user.email, form.data.password);
			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaTokenError && e.message === 'EXPIRED_TOKEN') {
				return fail(400, { form, message: 'Expired Token' });
			}
			if (e instanceof LuciaTokenError && e.message === 'INVALID_TOKEN') {
				return fail(400, { form, message: 'Invalid Token' });
			}
			console.error(e);
			return fail(400, { form, message: 'Unknown error' });
		}

		console.log(form);

		throw redirect(303, '/');
	}
};
