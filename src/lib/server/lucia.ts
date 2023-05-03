import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { prismaClient } from './db';
import { dev } from '$app/environment';
import { idToken } from '@lucia-auth/tokens';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { github } from './auth/providers/github';

export const auth = lucia({
	adapter: prisma(prismaClient),
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
	expiresIn: 60 * 60 // 1 hour
});

export type Auth = typeof auth;
