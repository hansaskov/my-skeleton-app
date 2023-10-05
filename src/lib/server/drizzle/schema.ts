import { type InferInsertModel, relations } from 'drizzle-orm';
import {
	mysqlTable,
	bigint,
	varchar,
	boolean,
	datetime,
	mysqlEnum,
	unique
} from 'drizzle-orm/mysql-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const currency = ['DKK', 'EUR', 'USD', 'GBP'] as const;
const wishlistRole = ['EDITABLE', 'INTERACTABLE', 'VIEWABLE'] as const;
const familyRole = ['MODERATOR', 'MEMBER'] as const;
export const tokenType = ['VALIDATE EMAIL', 'PASSWORD RESET'] as const;

export type Currency = (typeof currency)[number];
export type WishlistRole = (typeof wishlistRole)[number];
export type FamilyRole = (typeof familyRole)[number];
export type TokenEnum = (typeof tokenType)[number];

// Lucia Auth schema
export type User = typeof user.$inferSelect;
export const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 128 }).primaryKey(), // change this when using custom user ids
	email: varchar('email', { length: 255 }).notNull(),
	isEmailVerified: boolean('email_verified').notNull(),
	isUserInfoSet: boolean('user_info_set').notNull()
});

export const userRelations = relations(user, ({ one, many }) => ({
	// one-to-one relationship to userInfo
	info: one(userInfo, {
		fields: [user.id],
		references: [userInfo.userId]
	}),
	// many-to-one relationship with familyInvitation
	familyInvitation: many(familyInvitation),
	familiesOnUsers: many(familiesOnUsers),
	wishlistOnUsers: many(wishlistOnUsers)
}));

export type Session = typeof session.$inferSelect;
export const session = mysqlTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
	userId: varchar('user_id', { length: 128 }).notNull()
});

export type Key = typeof key.$inferSelect;
export const key = mysqlTable('auth_key', {
	id: varchar('id', { length: 128 }).primaryKey(),
	hashedPassword: varchar('hashed_password', { length: 255 }),
	userId: varchar('user_id', { length: 128 }).notNull()
});

// Authentication tokens
export type Token = typeof token.$inferSelect;
export const token = mysqlTable('auth_token', {
	id: varchar('id', { length: 128 }).primaryKey(),
	type: mysqlEnum('type', tokenType).notNull(),
	expires: bigint('expires', { mode: 'number' }).notNull(),
	userId: varchar('user_id', { length: 128 }).notNull()
});

// User info schema
export type UserInfo = typeof userInfo.$inferSelect;
export const userInfo = mysqlTable('user_info', {
	id: varchar('id', { length: 128 }).primaryKey(),
	fullname: varchar('full_name', { length: 256 }).notNull(),
	birthdate: datetime('birthdate').notNull(),
	imageUrl: varchar('image_url', { length: 512 }),

	userId: varchar('user_id', { length: 128 }).notNull()
});

// Wish schema
export type Wish = typeof wish.$inferInsert;
export const wish = mysqlTable('wish', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	price: bigint('price', { mode: 'number' }).notNull(),
	currency: mysqlEnum('currency', currency).default('DKK').notNull(),
	imageUrl: varchar('image_url', { length: 512 }),
	updatedAt: datetime('updated_at').notNull(),

	wishlistId: varchar('wishlist_id', { length: 128 }).notNull()
});

export const NewWishSchema = createInsertSchema(wish, {
	wishlistId: ({ wishlistId }) => wishlistId.min(1),
	name: ({name}) => name.min(1),
	price: ({ price }) => price.positive().default('' as unknown as number),
	imageUrl: ({imageUrl}) => imageUrl.url() 
}).omit({
	updatedAt: true,
	id: true
});

export const UpdateWishSchema = NewWishSchema.extend({
	id: z.string().min(1)
});

export type NewWish = z.infer<typeof NewWishSchema>;

export const wishRelations = relations(wish, ({ one }) => ({
	wishlists: one(wishlist, {
		fields: [wish.wishlistId],
		references: [wishlist.id]
	})
}));

export type Wishlist = typeof wishlist.$inferSelect;
export type NewWishlist = Omit<InferInsertModel<typeof wishlist>, 'id'>;
export const wishlist = mysqlTable('wishlist', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull()
});

export const wishlistRelation = relations(wishlist, ({ many }) => ({
	wishs: many(wish),
	wishlistOnUsers: many(wishlistOnUsers)
}));

export type WishlistOnUsers = typeof wishlistOnUsers.$inferSelect;
export const wishlistOnUsers = mysqlTable(
	'wishlist_on_users',
	{
		wishlistId: varchar('wishlist_id', { length: 128 }).notNull(),
		wishlistRole: mysqlEnum('wishlist_role', wishlistRole).default('VIEWABLE').notNull(),
		updatedAt: datetime('updated_at').notNull(),

		userId: varchar('user_id', { length: 128 }).notNull()
	},
	(t) => ({ first: unique().on(t.userId, t.wishlistId) })
);

// Many-To-Many Relationship
export const wishlistOnUsersRelations = relations(wishlistOnUsers, ({ one }) => ({
	wishlist: one(wishlist, {
		fields: [wishlistOnUsers.wishlistId],
		references: [wishlist.id]
	}),
	user: one(user, {
		fields: [wishlistOnUsers.userId],
		references: [user.id]
	})
}));

// Family schema
export type Family = typeof family.$inferSelect;
export type NewFamily = Omit<InferInsertModel<typeof family>, 'id'>;
export const family = mysqlTable('family', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull().default(true)
});

// one-to-many relationship
export const familyRelation = relations(family, ({ many }) => ({
	familyInvitation: many(familyInvitation),
	familiesOnUsers: many(familiesOnUsers)
}));

export type FamilyOnUsers = typeof familiesOnUsers.$inferSelect;
export type NewFamilyOnUsers = Omit<InferInsertModel<typeof familiesOnUsers>, 'updatedAt'>;
export const familiesOnUsers = mysqlTable(
	'families_on_users',
	{
		familyId: varchar('family_id', { length: 128 }).notNull(),
		userId: varchar('user_id', { length: 128 }).notNull(),
		familyRole: mysqlEnum('family_role', familyRole).notNull(),
		updatedAt: datetime('updated_at').notNull()
	},
	(t) => ({
		first: unique().on(t.userId, t.familyId)
	})
);

// Many-To-Many Relationship
export const familiesOnUsersRelations = relations(familiesOnUsers, ({ one }) => ({
	family: one(family, {
		fields: [familiesOnUsers.familyId],
		references: [family.id]
	}),
	user: one(user, {
		fields: [familiesOnUsers.userId],
		references: [user.id]
	})
}));

export type FamilyInvitation = typeof familyInvitation.$inferSelect;
export type NewFamilyInvitation = Omit<InferInsertModel<typeof familyInvitation>, 'id'>;
export const familyInvitation = mysqlTable(
	'family_invitation',
	{
		id: varchar('id', { length: 128 }).primaryKey(),
		email: varchar('email', { length: 255 }).notNull(),
		familyId: varchar('family_id', { length: 128 }).notNull(),
		invitingUserId: varchar('inviting_user_id', { length: 128 }).notNull()
	},
	(t) => ({
		first: unique().on(t.email, t.familyId)
	})
);
// Many-To-Many Relationship
export const familyInvitationRelations = relations(familyInvitation, ({ one }) => ({
	family: one(family, {
		fields: [familyInvitation.familyId],
		references: [family.id]
	}),
	user: one(user, {
		fields: [familyInvitation.invitingUserId],
		references: [user.id]
	})
}));
