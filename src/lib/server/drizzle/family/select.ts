import { eq, like, placeholder, sql, or, and, inArray } from 'drizzle-orm';
import { db } from '../db';
import { family, familiesOnUsers } from '../schema';

export async function selectFamiliesAndMembersForUser2(userId: string) {
	const user = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, userId),
		columns: {},
		with: {
			familiesOnUsers: {
				columns: {
					familyRole: true
				},
				with: {
					family: {
						with: {
							familiesOnUsers: {
								columns: {},
								with: {
									user: {
										columns: {},
										with: {
											info: {
												columns: {
													fullname: true,
													imageUrl: true
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	if (!user) return undefined;

	return user.familiesOnUsers;
}

export async function searchFamily(familyName: string) {
	const searhParam = `${familyName}`;
	const families = await db.select().from(family).where(like(family.name, searhParam));

	return families;
}

export async function selectFamilyOnUser({
	userId,
	familyId
}: {
	userId: string;
	familyId: string;
}) {
	const data = await db
		.select()
		.from(familiesOnUsers)
		.where(and(eq(familiesOnUsers.userId, userId), eq(familiesOnUsers.familyId, familyId)))
		.limit(1);

	const familiesOnUsersRelation = data.at(0);
	return familiesOnUsersRelation;
}
