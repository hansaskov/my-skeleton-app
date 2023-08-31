// lib/server/token.ts
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from './drizzle/db';
import { token, type TokenEnum } from './drizzle/schema';
import { and, eq } from 'drizzle-orm';

const errors = ['EXPIRED_TOKEN', 'INVALID_TOKEN'] as const;
type errorType = (typeof errors)[number];

export class TokenError extends Error {
	cause: errorType;

	constructor(cause: errorType, message: string) {
		super();
		this.cause = cause;
		this.message = message;
	}
}

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export async function generateToken({
	userId,
	tokenType
}: {
	userId: string;
	tokenType: TokenEnum;
}) {
	const storedUserTokens = await db
		.select()
		.from(token)
		.where(and(eq(token.userId, userId), eq(token.type, tokenType)));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find(({ expires }) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const tokenId = generateRandomString(63);
	await db.insert(token).values({
		id: tokenId,
		type: tokenType,
		expires: new Date().getTime() + EXPIRES_IN,
		userId: userId
	});

	return tokenId;
}

export async function validateToken({ tokenId }: { tokenId: string }) {
	const storedToken = await db.transaction(async (tx) => {
		// Get all tokens with token id
		const data = await tx.select().from(token).where(eq(token.id, tokenId));

		// Throw if none are found
		const storedToken = data.at(0);
		if (!storedToken)
			throw new TokenError(
				'INVALID_TOKEN',
				'Token was not found in db and the token is therefore invalid'
			);

		// If found, delete token
		await tx
			.delete(token)
			.where(and(eq(token.userId, storedToken.userId), eq(token.type, storedToken.type)));

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new TokenError(
			'EXPIRED_TOKEN',
			'The token was found in db but it has expired and is therefore invalid'
		);
	}

	return storedToken.userId;
}
