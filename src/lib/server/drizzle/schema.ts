import type { InferModel } from 'drizzle-orm';
import {
	mysqlTable,
	bigint,
	varchar,
	boolean,
	datetime,
	mysqlEnum,
	unique
} from 'drizzle-orm/mysql-core';

const currency = ['DKK', 'EUR', 'USD', 'GBP'] as const;
const wishlistRole = ['EDITABLE', 'INTERACTABLE', 'VIEWABLE'] as const;
const familyRole = ['MODERATOR', 'MEMBER'] as const;

export type Currency = (typeof currency)[number];
export type WishlistRole = (typeof wishlistRole)[number];
export type FamilyRole = (typeof familyRole)[number];

// Lucia Auth schema
export type User = InferModel<typeof user>;
export const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 128 }).primaryKey(), // change this when using custom user ids
	email: varchar('email', { length: 255 }).notNull(),
	isEmailVerified: boolean('email_verified').notNull(),
	isUserInfoSet: boolean('user_info_set').notNull()
});

export type Session = InferModel<typeof session>;
export const session = mysqlTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
	userId: varchar('user_id', { length: 128 }).notNull()
});

export type Key = InferModel<typeof key>;
export const key = mysqlTable('auth_key', {
	id: varchar('id', { length: 128 }).primaryKey(),
	hashedPassword: varchar('hashed_password', { length: 255 }),
	userId: varchar('user_id', { length: 128 }).notNull()
});

// Authentication tokens
export type EmailVerificationToken = InferModel<typeof emailVerificationToken>;
export const emailVerificationToken = mysqlTable('email_verification_token', {
	id: varchar('id', { length: 128 }).primaryKey(),
	expires: bigint('expires', { mode: 'number' }).notNull(),
	userId: varchar('user_id', { length: 128 }).notNull()
});

export type PasswordResetToken = InferModel<typeof passwordResetToken>;
export const passwordResetToken = mysqlTable('password_reset_token', {
	id: varchar('id', { length: 128 }).primaryKey(),
	expires: bigint('expires', { mode: 'number' }).notNull(),
	userId: varchar('user_id', { length: 128 }).notNull()
});

// User info schema
export type UserInfo = InferModel<typeof userInfo>;
export const userInfo = mysqlTable('user_info', {
	id: varchar('id', { length: 128 }).primaryKey(),
	fullname: varchar('full_name', { length: 256 }).notNull(),
	birthdate: datetime('birthdate').notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	imageUrl: varchar('image_url', { length: 512 }),

	userId: varchar('user_id', { length: 128 }).notNull()
});

// Wish schema
export type Wish = InferModel<typeof wish>;
export type NewWish = Omit<InferModel<typeof wish, 'insert'>, 'id' | 'updatedAt'>;
export const wish = mysqlTable('wish', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	price: bigint('price', { mode: 'number' }).notNull(),
	currency: mysqlEnum('currency', currency).default('DKK').notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	imageUrl: varchar('image_url', { length: 512 }).notNull(),
	updatedAt: datetime('updated_at').notNull(),

	wishlistId: varchar('wishlist_id', { length: 128 }).notNull().unique()
});
export type Wishlist = InferModel<typeof wishlist>;
export type NewWishlist = Omit<InferModel<typeof wishlist, 'insert'>, 'id'>;
export const wishlist = mysqlTable('wishlist', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull()
});

export type WishlistOnUsers = InferModel<typeof wishlistOnUsers>;
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

// Family schema
export type Family = InferModel<typeof family>;
export type NewFamily = Omit<InferModel<typeof family, 'insert'>, 'id'>;
export const family = mysqlTable('family', {
	id: varchar('id', { length: 128 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	is_public: boolean('is_public').notNull().default(true)
});

export type FamilyOnUsers = InferModel<typeof familiesOnUsers>;
export type NewFamilyOnUsers = Omit<InferModel<typeof familiesOnUsers, 'insert'>, 'updatedAt'>;
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
