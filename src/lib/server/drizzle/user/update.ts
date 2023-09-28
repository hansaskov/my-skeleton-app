import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userInfo, type UserInfo } from '../schema';
import type { Prettify } from '$lib/types/wrappers';

type OmitUserInfo = Omit<UserInfo, 'id' | 'userId'>;
type PickUserId = Pick<UserInfo, 'userId'>;
type UpdateUserInfo = PickUserId & Partial<OmitUserInfo>;

export async function updateUserInfo(params: Prettify<UpdateUserInfo>) {
	await db.update(userInfo).set(params).where(eq(userInfo.userId, params.userId));
}
