import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { userInfo } from '../schema';



const prepared = db
	.select()
	.from(userInfo)
	.where(eq(userInfo.userId, sql.placeholder('id')))
	.limit(1)
	.prepare();

export async function getUserInfo(userId: string) {
	const UserInfo = await prepared.execute({ id: userId });
	if (UserInfo.length > 0) {
		return UserInfo[0];
	} else {
		return null;
	}
}
