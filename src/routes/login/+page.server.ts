import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia-auth';
import { schema } from '$lib/schemas/authentication';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	// Validates Page Schema
	const form = await superValidate(schema.login);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema.login);
		if (!form.valid) return fail(400, { form });
		try {
			const key = await auth.useKey('email', form.data.email, form.data.password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError) {
				switch (e.message) {
					case 'AUTH_INVALID_PASSWORD':
						return setError(form, 'password', 'Invalid password');

					case 'AUTH_OUTDATED_PASSWORD':
						return setError(form, 'password', 'Outdated password');
				}
			}

			console.error(e);
			return fail(400, { form, message: 'Unknown error' });
		}

		return { form };
	}
};
