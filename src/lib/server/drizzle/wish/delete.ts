import { db } from '../db';
import { wish } from '../schema';
import { eq } from 'drizzle-orm';

export async function deleteWish({ wishId }: { wishId: string }) {
	await db.delete(wish).where(eq(wish.id, wishId));
}
