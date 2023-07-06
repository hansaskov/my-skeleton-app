import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { dev } from '$app/environment';
import { idToken } from '@lucia-auth/tokens';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { github } from './auth/providers/github';
import { ps_connection } from './planetscale';

export const auth = lucia({
	adapter: planetscale(ps_connection as any),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
			emailVerified: userData.email_verified,
			userInfoSet: userData.user_info_set
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	scope: ['user:email']
});

export const emailVerificationToken = idToken(auth, 'email_verification', {
	expiresIn: 60 * 60 * 8 // 8 hours
});

export const passwordResetToken = idToken(auth, 'password_reset', {
	expiresIn: 60 * 30 // 30 minutes
});

export type Auth = typeof auth;
