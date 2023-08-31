import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { familyInvitation } from '../schema';

export async function deleteInvite(inviteId: string) {
	await db.delete(familyInvitation).where(eq(familyInvitation.id, inviteId));
}

export async function deleteInvitesFromFamilyWithEmail({
	email,
	familyId
}: {
	email: string;
	familyId: string;
}) {
	await db
		.delete(familyInvitation)
		.where(and(eq(familyInvitation.familyId, familyId), eq(familyInvitation.email, email)));
}
