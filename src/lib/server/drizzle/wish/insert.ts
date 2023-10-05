import type { NewWish } from '../schema';

import { generateRandomString } from 'lucia/utils';
import { wish } from '../schema';
import { db } from '../db';
import type { Prettify } from '$lib/types/wrappers';



export async function createWish(newWish: Prettify<NewWish>) {
	const wishId = generateRandomString(32);

	await db.insert(wish).values({
		id: wishId,
		updatedAt: new Date(),
		...newWish
	});
}
