import type { Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login');
	}
};
