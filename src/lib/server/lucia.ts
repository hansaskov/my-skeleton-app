import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { dev } from '$app/environment';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { planetscale_connection } from './planetscale';
import { github } from './auth/providers/github';

export const auth = lucia({
	adapter: planetscale(planetscale_connection as any, {
		user: 'auth_user',
		key: 'auth_key',
		session: 'auth_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			emailVerified: data.email_verified,
			userInfoSet: data.user_info_set
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	scope: ['user:email']
});

export type Auth = typeof auth;
