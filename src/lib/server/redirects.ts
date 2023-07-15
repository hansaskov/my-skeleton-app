import type { User } from 'lucia-auth';
import { db } from './planetscale';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent } from '@sveltejs/kit';

export const callbacks = {
	login: {
		page: '/login',
		message: {
			type: 'error',
			message: 'Please sign in to access this page'
		}
	},
	setup: {
		page: '/signup/setup',
		message: {
			type: 'success',
			message: 'Please tell us about yourself before continuing'
		}
	},
	email: {
		page: '/email/verification',
		message: {
			type: 'success',
			message: 'Please check your inbox and verify your E-mail'
		}
	},
	invalid_token: {
		page: '/',
		message: {
			type: 'error',
			message: 'Invalid Token, redirected to home-page'
		}
	}
} as const;

export async function redirectFromPrivatePage(user: User | null, event: RequestEvent) {
	// Redirect to email verification or setup
	if (!user) throw redirect(302, callbacks.login.page, callbacks.login.message, event);
	if (!user.userInfoSet) throw redirect(302, callbacks.setup.page, callbacks.setup.message, event);
	if (!user.emailVerified)
		throw redirect(302, callbacks.email.page, callbacks.email.message, event);

	const userInfo = await db.query.userInfo.findFirst({
		where: (userInfo, { eq }) => eq(userInfo.userId, user.userId)
	});

	if (!userInfo) throw redirect(302, callbacks.setup.page, callbacks.setup.message, event);

	return { userInfo, user };
}

export function handleSignedinRedirect(user: User, event: RequestEvent): never {
	if (!user.userInfoSet) throw redirect(302, callbacks.setup.page, callbacks.setup.message, event);
	if (!user.emailVerified)
		throw redirect(302, callbacks.email.page, callbacks.email.message, event);
	throw redirect(302, '/');
}

export function redirectFromValidateEmail(user: User | null, event: RequestEvent) {
	if (!user) throw redirect(302, callbacks.login.page, callbacks.login.message, event);
	if (!user.userInfoSet) throw redirect(302, callbacks.setup.page, callbacks.setup.message, event);

	return { user };
}
