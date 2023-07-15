import { mysqlTable, varchar, tinyint, bigint, datetime } from 'drizzle-orm/mysql-core';

export const authKey = mysqlTable('auth_key', {
	id: varchar('id', { length: 255 }).primaryKey().notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 }),
	userId: varchar('user_id', { length: 15 }).notNull(),
	primaryKey: tinyint('primary_key').notNull(),
	expires: bigint('expires', { mode: 'number' })
});

export const authSession = mysqlTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey().notNull(),
	userId: varchar('user_id', { length: 15 }).notNull(),
	activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
	idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const authUser = mysqlTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey().notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: tinyint('email_verified').default(0).notNull(),
	userInfoSet: tinyint('user_info_set').default(0).notNull()
});

export const userInfo = mysqlTable('user_info', {
	id: varchar('id', { length: 255 }).primaryKey().notNull(),
	fullName: varchar('full_name', { length: 256 }).notNull(),
	birthdate: datetime('birthdate', { mode: 'string' }).notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	imageUrl: varchar('image_url', { length: 512 }),
	userId: varchar('user_id', { length: 255 }).notNull()
});
