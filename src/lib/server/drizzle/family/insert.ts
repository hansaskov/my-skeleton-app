import { generateRandomString } from 'lucia/utils';
import { db } from '../db';
import {
	family,
	familiesOnUsers,
	type NewFamily,
	type NewFamilyInvitation,
	familyInvitation,
	type NewFamilyOnUsers
} from '../schema';

export async function createNewFamily(newFamily: NewFamily, userId: string) {
	const familyId = generateRandomString(63);

	await db.transaction(async (tx) => {
		await tx.insert(family).values({
			id: familyId,
			name: newFamily.name,
			is_public: newFamily.is_public
		});

		await tx.insert(familiesOnUsers).values({
			familyId: familyId,
			userId: userId,
			familyRole: 'MODERATOR',
			updatedAt: new Date()
		});
	});
}

export async function addUserToFamily(data: NewFamilyOnUsers) {
	const updatedAt = new Date();

	await db.insert(familiesOnUsers).values({ updatedAt, ...data });
}

export async function sendFamilyInvite(data: NewFamilyInvitation) {
	const id = generateRandomString(63);

	await db.insert(familyInvitation).values({ id, ...data });
}
