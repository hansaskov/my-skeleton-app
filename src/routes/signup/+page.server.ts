import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { fail, type Actions } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';


function containsNumber(str: string) {
	for (const c of str) {
		if ( c >= '0' && c <= '9')
			return true
	}
	return false
}

const schema = z.object({
	username: z.string().trim().min(1).max(255),
	password: z.string().min(6).max(255).refine( containsNumber, {message: "Password must contain at least one number"} )
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
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: form.data.username,
					password: form.data.password
				},
				attributes: {
					username: form.data.username
				}
			});
			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				error.message?.includes('username')
			) {
				return setError(form, 'username', `Username "${form.data.username}" already in use`);
			}
			if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
				return setError(form, 'username', `Username "${form.data.username}" already in use`);
			}
			console.error(error);
			return fail(400, { form, message: 'Unknown error' });
		}

		return { form };
	}
};
