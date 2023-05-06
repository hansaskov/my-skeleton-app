import { redirect } from '@sveltejs/kit';
import type { User } from 'lucia-auth';

const redirectTo = 'redirectTo';

export function redirectToLogin(callbackUrl: URL, message = 'Please sign in to access this page') {
	const path = callbackUrl.pathname + callbackUrl.search;
	return `/login?${redirectTo}=${path}&message=${message}`;
}

export function redirectFromLogin(callbackUrl: URL) {
	const path = callbackUrl.searchParams.get(redirectTo);
	if (path) return `/${path.slice(1)}`;
	else return '/';
}

export function redirectFromPrivatePage(user: User) {
	// Redirect to email verification or setup
	if (!user.userInfoSet) throw redirect(302, '/signup/setup');
	if (!user.emailVerified) throw redirect(302, '/email/verification');
}
