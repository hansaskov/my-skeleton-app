import { eq } from 'drizzle-orm';
import { db } from '../db';
import { familyInvitation } from '../schema';

export async function selectAllFamilyInvitesFromEmail(email: string) {
	const invites = await db.query.familyInvitation.findMany({
		columns: {
			id: true
		},
		with: {
			family: true,
			user: {
				columns: {
					id: true
				},
				with: {
					info: {
						columns: {
							fullname: true,
							imageUrl: true
						}
					}
				}
			}
		},
		where: eq(familyInvitation.email, email)
	});

	return invites;
}

export async function selectPendingFamilyInvitesFromUserId(userId: string) {
	const invites = await db.query.familyInvitation.findMany({
		columns: {
			id: true,
			email: true
		},
		with: {
			family: {
				columns: {
					name: true
				}
			}
		},
		where: eq(familyInvitation.invitingUserId, userId)
	});

	return invites;
}
