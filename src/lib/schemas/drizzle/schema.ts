import { mysqlTable, bigint, varchar, boolean, datetime } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

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

	userId: varchar('user_id', { length: 255 }).notNull()
});

export const usersRelation = relations(user, ({ one }) => ({
	userInfo: one(userInfo, {
		fields: [user.id],
		references: [userInfo.userId]
	})
}));
