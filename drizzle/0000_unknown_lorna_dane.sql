CREATE TABLE `families_on_users` (
	`family_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`family_role` enum('MODERATOR','MEMBER') NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `families_on_users_user_id_family_id_unique` UNIQUE(`user_id`,`family_id`)
);
--> statement-breakpoint
CREATE TABLE `family` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_public` boolean NOT NULL DEFAULT true,
	CONSTRAINT `family_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_key` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`primary_key` boolean NOT NULL,
	`hashed_password` varchar(255),
	`expires` bigint,
	CONSTRAINT `auth_key_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL,
	CONSTRAINT `auth_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`user_info_set` boolean NOT NULL DEFAULT false,
	CONSTRAINT `auth_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_info` (
	`id` varchar(255) NOT NULL,
	`full_name` varchar(256) NOT NULL,
	`birthdate` datetime NOT NULL,
	`description` varchar(1024) NOT NULL,
	`image_url` varchar(512),
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `user_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wish` (
	`id` varchar(255) NOT NULL,
	`name` varchar(256) NOT NULL,
	`price` bigint NOT NULL,
	`currency` enum('DKK','EUR','USD','GBP') NOT NULL DEFAULT 'DKK',
	`description` varchar(1024) NOT NULL,
	`image_url` varchar(512) NOT NULL,
	`updated_at` datetime NOT NULL,
	`wishlist_id` varchar(255) NOT NULL,
	CONSTRAINT `wish_id` PRIMARY KEY(`id`),
	CONSTRAINT `wish_wishlist_id_unique` UNIQUE(`wishlist_id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_public` boolean NOT NULL DEFAULT true,
	CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_on_users` (
	`wishlist_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`wishlist_role` enum('EDITABLE','INTERACTABLE','VIEWABLE') NOT NULL DEFAULT 'VIEWABLE',
	`updated_at` datetime NOT NULL,
	CONSTRAINT `wishlist_on_users_user_id_wishlist_id_unique` UNIQUE(`user_id`,`wishlist_id`)
);
