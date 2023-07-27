import { eq, placeholder } from 'drizzle-orm';
import { db } from '../db';
import {
	family,
	familiesOnUsers,
	user,
	userInfo,
	type Family,
	type User,
	type UserInfo
} from '../schema';

type GroupedData = Record<string, Family & { users: { user: User; userInfo: UserInfo }[] }>;

const prepare = db
	.select({ family, user, userInfo })
	.from(family)
	.innerJoin(familiesOnUsers, eq(familiesOnUsers.familyId, family.id))
	.innerJoin(user, eq(familiesOnUsers.userId, placeholder('id')))
	.innerJoin(userInfo, eq(userInfo.userId, placeholder('id')))
	.where(eq(user.id, placeholder('id')))
	.prepare();

export async function selectAllFamilyMembersFromUser(userId: string) {
	const data = await prepare.execute({ id: userId });

	// Group data by unique family id
	const groupedData = data.reduce((result: GroupedData, { family, user, userInfo }) => {
		if (!result[family.id]) {
			result[family.id] = { ...family, users: [] };
		}

		result[family.id].users.push({ user, userInfo });

		return result;
	}, {});

	// Then Convert the hashmap object to an array
	const transformedData = Object.values(groupedData);

	return transformedData;
}
