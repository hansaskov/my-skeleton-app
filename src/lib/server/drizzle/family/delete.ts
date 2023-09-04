import { db } from '../db';
import { familiesOnUsers, family, familyInvitation } from '../schema';
import { and, eq } from 'drizzle-orm';

export async function deleteUserFromFamily(familyId: string, userId: string) {
	db.delete(familiesOnUsers).where(
		and(eq(familiesOnUsers.userId, userId), eq(familiesOnUsers.familyId, familyId))
	);
}

export async function deleteFamily({ familyId }: { familyId: string }) {
	await db.transaction(async (tx) => {
		await tx.delete(familiesOnUsers).where(eq(familiesOnUsers.familyId, familyId));
		await tx.delete(familyInvitation).where(eq(familyInvitation.familyId, familyId));
		await tx.delete(family).where(eq(family.id, familyId));
	});
}
