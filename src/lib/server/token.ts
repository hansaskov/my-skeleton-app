// lib/server/token.ts
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from './drizzle/db';
import { token, type TokenEnum } from './drizzle/schema';
import { eq } from 'drizzle-orm';

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
		.where(eq(token.userId, userId))
		.where(eq(token.type, tokenType));

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
		const data = await tx.select().from(token).where(eq(token.id, tokenId));

		const storedToken = data.at(0);
		if (!storedToken) throw new Error('Invalid token');

		await tx.delete(token).where(eq(token.userId, storedToken.userId));

		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
}
