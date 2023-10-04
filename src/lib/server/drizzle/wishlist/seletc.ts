import { db } from '../db';

export async function selectWishlistsOnUser(userId: string) {
	const wishlistOnUsers = await db.query.wishlistOnUsers.findMany({
		where: (wishlistOnUser, { eq }) => eq(wishlistOnUser.userId, userId),
		columns: { updatedAt: true, wishlistRole: true },
		with: {
			wishlist: {
				with: {
					wishs: true
				}
			}
		}
	});

	const wishlists = wishlistOnUsers.map(({ wishlist, updatedAt, wishlistRole }) => ({
		...wishlist,
		updatedAt,
		wishlistRole
	}));

	return wishlists;
}

export async function selectWishlistsOnId(wishlistId: string) {
	const wishlistOnUsers = await db.query.wishlist.findFirst({
		where: (wishlist, { eq }) => eq(wishlist.id, wishlistId),
		with: {
			wishs: true
		}
	});

	return wishlistOnUsers;
}

export async function selectRoleforWishlistOnUser({
	wishlistId,
	userId
}: {
	wishlistId: string;
	userId: string;
}) {
	return await db.query.wishlistOnUsers.findFirst({
		where: (table, { eq, and }) => and(eq(table.userId, userId), eq(table.wishlistId, wishlistId))
	});
}

export async function selectRoleforWishOnUser({
	wishId,
	userId
}: {
	wishId: string;
	userId: string;
}) {
	const wish = await db.query.wish.findFirst({
		where: (wish, { eq }) => eq(wish.id, wishId),
		columns: {},
		with: {
			wishlists: {
				columns: {},
				with: {
					wishlistOnUsers: {
						columns: { wishlistRole: true },
						where: (table, { eq }) => eq(table.userId, userId),
						limit: 1
					}
				}
			}
		}
	});

	if (!wish) return wish;

	const role = wish.wishlists.wishlistOnUsers.at(0);

	return role;
}
