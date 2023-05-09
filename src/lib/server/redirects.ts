import { redirect } from '@sveltejs/kit';
import type { User } from 'lucia-auth';

export const redirectTo = 'redirectTo';

export const callbacks = {
	login: {
		page: '/login',
		message: 'Please sign in to access this page'
	},
	setup: {
		page: '/signup/setup',
		message: 'Please tell us about yourself before continuing'
	},
	email: {
		page: '/email/verification',
		message: 'Please check your inbox and verify your E-mail'
	}
};

type CallbackParam = typeof callbacks.login;

// Remove and insert the first char in the string with "/"
function sanityzeUrl(url: string) {
	return '/' + url.slice(1);
}

export function createCallbackUrl({ page, message }: CallbackParam, url: URL) {
	const redirectToPath = url.searchParams.get(redirectTo);

	let path = '';

	if (redirectToPath) {
		path = sanityzeUrl(redirectToPath);
	} else {
		path = url.pathname + url.search;
	}

	const callbackUrl = `${page}?${redirectTo}=${path}&message=${message}`;

	return callbackUrl;
}

export function getCallbackUrl(callbackUrl: URL) {
	const path = callbackUrl.searchParams.get(redirectTo);

	if (path) return sanityzeUrl(path);
	else return '/';
}

export function redirectFromPrivatePage(user: User | null, url: URL) {
	// Redirect to email verification or setup
	if (!user) throw redirect(302, createCallbackUrl(callbacks.login, url));
	if (!user.userInfoSet) throw redirect(302, createCallbackUrl(callbacks.setup, url));
	if (!user.emailVerified) throw redirect(302, createCallbackUrl(callbacks.email, url));

	return user;
}

export function redirectFromSignin(user: User | null, url: URL) {
	if (user && user.userInfoSet == false)
		throw redirect(302, createCallbackUrl(callbacks.setup, url));
	if (user && user.emailVerified == false)
		throw redirect(302, createCallbackUrl(callbacks.email, url));
	if (user) throw redirect(302, getCallbackUrl(url));
}
