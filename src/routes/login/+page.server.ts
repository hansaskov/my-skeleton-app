import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(1)
});

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });
		try {
			const key = await auth.useKey('email', form.data.email, form.data.password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch {
			// invalid credentials
			return setError(form, 'password', 'invalid credentials');
		}

		return { form };
	}
};
