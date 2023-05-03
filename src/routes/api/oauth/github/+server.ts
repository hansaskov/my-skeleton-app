import { auth, githubAuth } from '$lib/server/lucia';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
	// get code and state params from url
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// valicate state params
	if (!code || !state) throw new Response('Invalid searchparams', { status: 401 });

	// get stored state from cookies
	const storedState = cookies.get('github_oauth_state');

	// validate state
	if (state !== storedState) throw new Response('Invalid state', { status: 401 });

	try {
		const { existingUser, createUser, providerEmails } = await githubAuth.validateCallback(code);

		const primaryEmail = providerEmails.find((x) => x.primary);
		if (!primaryEmail) throw new Response('Missing primary E-mail', { status: 400 });

		const getUser = async () => {
			if (existingUser) return existingUser;
			// create a new user if the user does not exist
			return await createUser({
				// attributes
				email: primaryEmail.email,
				email_verified: primaryEmail.verified,
				user_info_set: false
			});
		};
		const user = await getUser();
		const session = await auth.createSession(user.userId);
		locals.auth.setSession(session);
	} catch (e) {
		// invalid code
		return new Response('Unknown error', {
			status: 500
		});
	}

	// Go to Homepage
	throw redirect(302, '/');
};
