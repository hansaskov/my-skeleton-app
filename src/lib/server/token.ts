// lib/server/token.ts
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from './drizzle/db';
import { emailVerificationToken, passwordResetToken } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db
		.select()
		.from(emailVerificationToken)
		.where(eq(emailVerificationToken.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db.insert(emailVerificationToken).values({
		id: token,
		expires: new Date().getTime() + EXPIRES_IN,
		userId: userId
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await db.transaction(async (tx) => {
		const data = await tx
			.select()
			.from(emailVerificationToken)
			.where(eq(emailVerificationToken.id, token));

		const storedToken = data.at(0);
		if (!storedToken) throw new Error('Invalid token');

		await tx
			.delete(emailVerificationToken)
			.where(eq(emailVerificationToken.userId, storedToken.userId));

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.userId;
};

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await db
		.select()
		.from(passwordResetToken)
		.where(eq(passwordResetToken.userId, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db.insert(passwordResetToken).values({
		id: token,
		expires: new Date().getTime() + EXPIRES_IN,
		userId: userId
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	const storedToken = await db.transaction(async (tx) => {
		const data = await tx.select().from(passwordResetToken).where(eq(passwordResetToken.id, token));

		const storedToken = data.at(0);
		if (!storedToken) throw new Error('Invalid token');

		await tx.delete(passwordResetToken).where(eq(passwordResetToken.userId, storedToken.userId));

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.userId;
};
