import { eq, placeholder } from 'drizzle-orm';
import { db } from '../db';
import {
	family,
	familiesOnUsers,
	type NewFamily,
	user,
	userInfo,
	type Family,
	type User,
	type UserInfo
} from '../schema';

export async function selectUsersOnFamily(familyId: string) {
	const data = await db
		.select({ user, userInfo })
		.from(user)
		.innerJoin(familiesOnUsers, eq(user.id, familiesOnUsers.userId))
		.innerJoin(userInfo, eq(user.id, userInfo.userId))
		.where(eq(familiesOnUsers.familyId, familyId))
		.where(eq(userInfo.userId, user.id));
	return data;
}

export async function selectAllFamilyMembersFromUser(userId: string) {
	const data = await db
		.select({ family, user, userInfo })
		.from(family)
		.innerJoin(familiesOnUsers, eq(family.id, familiesOnUsers.familyId))
		.innerJoin(user, eq(user.id, familiesOnUsers.userId))
		.innerJoin(userInfo, eq(user.id, userInfo.userId))
		.where(eq(familiesOnUsers.userId, userId))
		.where(eq(userInfo.userId, user.id));

	type GroupedData = Record<string, Family & { users: { user: User; userInfo: UserInfo }[] }>;

	// Group the data by family id
	const groupedData = data.reduce((result: GroupedData, { family, user, userInfo }) => {
		if (!result[family.id]) {
			result[family.id] = { ...family, users: [] };
		}

		result[family.id].users.push({ user, userInfo });

		return result;
	}, {});

	// Convert the grouped data object to an array
	const transformedData = Object.values(groupedData);

	return transformedData;
}

export async function selectFamilyOnUsers(userId: string) {
	const data = await db
		.select({ family })
		.from(family)
		.leftJoin(familiesOnUsers, eq(family.id, familiesOnUsers.familyId))
		.where(eq(familiesOnUsers.userId, userId));

	const families = data.map(({ family }) => family);
	return families;
}
