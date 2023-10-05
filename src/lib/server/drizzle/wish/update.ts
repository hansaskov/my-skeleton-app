import type { NewWish, Wish } from '../schema';

import { generateRandomString } from 'lucia/utils';
import { wish } from '../schema';
import { db } from '../db';
import type { Prettify } from '$lib/types/wrappers';
import { eq } from 'drizzle-orm';

type OmitWishId = Omit<Wish, 'id'>;
type PickWishId = Pick<Wish, 'id'>;
type UpdateUserInfo = PickWishId & Partial<OmitWishId>;

export async function updateWish(newWish: Prettify<UpdateUserInfo>) {

    if (!newWish.updatedAt) {
        newWish.updatedAt = new Date()
    }

	await db.update(wish)
        .set({...newWish})
        .where(eq(wish.id, newWish.id))
}
