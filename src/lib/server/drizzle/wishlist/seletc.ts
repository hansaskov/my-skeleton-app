import { db } from '../db';
import { selectUserInfoOnUsername } from '../user/select';

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

export async function selectRoleOnWishlistNameandUserId({
	wishlistName,
	userId
}: {
	wishlistName: string;
	userId: string;
}) {
	const wishlist = await db.query.wishlist.findFirst({
		where: (wishlist, {eq}) => eq(wishlist.name, wishlistName),
		with: {
			wishlistOnUsers: {
				where: (wishlistOnUser, {eq}) => eq(wishlistOnUser.userId, userId)
			}
		}
	});

	const role = wishlist?.wishlistOnUsers.at(0)

	return role
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

export async function selectWishlistOnNameAndUserId({wishlistName, userId}: {wishlistName: string, userId: string}) {
	const data = await db.query.wishlist.findFirst({
		where: (wish, { eq }) => eq(wish.name, wishlistName),
		with: {
			wishlistOnUsers: {
				where: (wishlistOnUsers, {eq}) => eq(wishlistOnUsers.userId, userId),
			},
			wishs: true
		}
	})

	if (!data)
		return undefined

	const {wishlistOnUsers, ...wishlist} = data

	return wishlist
}

export async function selectWishlistOnNameAndUsername({wishlistName, username}: {wishlistName: string, username: string}) {

	const userInfo = await selectUserInfoOnUsername(username)

	if (!userInfo) 
		return undefined

	return await selectWishlistOnNameAndUserId({wishlistName, userId: userInfo.userId})

}