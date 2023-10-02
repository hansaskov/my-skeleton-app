import { generateRandomString } from 'lucia/utils';
import { wishlist, type NewWishlist, wishlistOnUsers } from '../schema';
import { db } from '../db';
import type { Prettify } from '$lib/types/wrappers';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

export async function createWishlist(newWishList: Prettify<NewWishlist>, userId: string) {
	const wishlistId = generateRandomString(12, ALPHABET);

	await db.transaction(async (tx) => {
		await tx.insert(wishlist).values({
			id: wishlistId,
			...newWishList
		});

		await tx.insert(wishlistOnUsers).values({
			wishlistId: wishlistId,
			userId: userId,
			updatedAt: new Date(),
			wishlistRole: 'EDITABLE'
		});
	});

	return wishlistId;
}
