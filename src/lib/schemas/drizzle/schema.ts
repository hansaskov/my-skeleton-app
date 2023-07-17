import { mysqlTable, bigint, varchar, boolean, datetime, mysqlEnum, unique } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Enums for mysql schema
const enums: {
	currency: readonly [string, ...string[]];
	wishlistRole: readonly [string, ...string[]];
	familyRole: readonly [string, ...string[]];
} = {
	currency: ['DKK', 'EUR', 'USD', 'GBP'],
	wishlistRole: ['EDITABLE', 'INTERACTABLE', 'VIEWABLE'],
	familyRole: ['MODERATOR', 'MEMBER']
};

// Lucia Auth schema
export const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey(), // change this when using custom user ids
	email: varchar('email', { length: 255 }).notNull(),
	isEmailVerified: boolean('email_verified').notNull().default(false),
	isUserInfoSet: boolean('user_info_set').notNull().default(false)
});

export const session = mysqlTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const key = mysqlTable('auth_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	primaryKey: boolean('primary_key').notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 }),
	expires: bigint('expires', { mode: 'number' })
});

// User info
export const userInfo = mysqlTable('user_info', {
	id: varchar('id', { length: 255 }).primaryKey(),
	fullname: varchar('full_name', { length: 256 }).notNull(),
	birthdate: datetime('birthdate').notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	imageUrl: varchar('image_url', { length: 512 }),

	userId: varchar('user_id', { length: 255 }).notNull().unique()
});

export const usersRelation = relations(user, ({ one }) => ({
	userInfo: one(userInfo, {
		fields: [user.id],
		references: [userInfo.userId]
	})
}));

// Wish schema
export const wish = mysqlTable('wish', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	price: bigint('price', { mode: 'number' }).notNull(),
	currency: mysqlEnum('currency', enums.currency).default('DKK').notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	imageUrl: varchar('image_url', { length: 512 }).notNull(),
	updatedAt: datetime('updated_at').notNull(),

	wishlistId: varchar('wishlist_id', { length: 255 }).notNull().unique()
});

export const wishlist = mysqlTable('wishlist', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull().default(true)
});

export const wishlistOnUsers = mysqlTable('wishlist_on_users', {
	wishlistId: varchar('wishlist_id', { length: 255 }).notNull(),
	userId: varchar('user_id', { length: 255 }).notNull(),
	wishlistRole: mysqlEnum('wishlist_role', enums.wishlistRole).default('VIEWABLE').notNull(),
	updatedAt: datetime('updated_at').notNull(),
}, 
(t) => ({
	first: unique().on(t.userId, t.wishlistId)
}));

// Family schema
export const family = mysqlTable('family', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull().default(true)
});

export const familiesOnUsers = mysqlTable('families_on_users', {
	familyId: varchar('family_id', { length: 255 }).notNull(),
	userId: varchar('user_id', { length: 255 }).notNull(),
	familyRole: mysqlEnum('family_role', enums.familyRole).default('MEMBER').notNull(),
	updatedAt: datetime('updated_at').notNull()
},
(t) => ({
	first: unique().on(t.userId, t.familyId)
}));
