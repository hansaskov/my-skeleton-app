import type { Session, User } from 'lucia';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent } from '@sveltejs/kit';
import { getUserInfo } from '../drizzle/user/select';

export const callbacks = {
	login: {
		type: 'error',
		message: 'Please sign in to access this page',
		page: '/login'
	},
	setup: {
		userInfo: {
			type: 'success',
			message: 'Please tell us about yourself before continuing',
			page: '/signup/setup'
		},
		email: {
			type: 'success',
			message: 'Please check your inbox and verify your E-mail',
			page: '/email/verification'
		}
	},
	email: {
		verified: {
			type: 'success',
			message: 'Email was successfully verified!',
			page: '/'
		},
		invalid_token: {
			type: 'error',
			message: 'Invalid Token, redirected to home-page',
			page: '/'
		}
	},
	family: {
		created: {
			type: 'success',
			message: 'Family was successfully created!',
			page: '/family'
		},
		invite: {
			type: 'success',
			message: 'invite was successfully sent',
			page: '/family'
		}
	},
	wishlist: {}
} as const;

export async function redirectFromPrivatePage(session: Session | null, event: RequestEvent) {
	// Redirect to email verification or setup
	if (!session) throw redirect(callbacks.login.page, callbacks.login, event);
	if (!session.user.userInfoSet)
		throw redirect(callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);
	if (!session.user.emailVerified)
		throw redirect(callbacks.setup.email.page, callbacks.setup.email, event);

	const userInfo = await getUserInfo(session.user.userId);

	if (!userInfo) throw redirect(callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);

	return { userInfo, user: session.user };
}

export function handleSignedinRedirect(user: User, event: RequestEvent): never {
	if (!user.userInfoSet)
		throw redirect(callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);
	if (!user.emailVerified) throw redirect(callbacks.setup.email.page, callbacks.setup.email, event);
	throw redirect(302, '/');
}

export function redirectFromValidateEmail(user: User | null, event: RequestEvent) {
	if (!user) throw redirect(callbacks.login.page, callbacks.login, event);
	if (!user.userInfoSet)
		throw redirect(callbacks.setup.userInfo.page, callbacks.setup.userInfo, event);

	return { user };
}
