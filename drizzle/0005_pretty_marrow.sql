CREATE TABLE `families_on_users` (
	`family_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`family_role` enum('MODERATOR','MEMBER') NOT NULL DEFAULT 'MEMBER',
	`updated_at` datetime NOT NULL);
--> statement-breakpoint
CREATE TABLE `family` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_public` boolean NOT NULL DEFAULT true);
--> statement-breakpoint
CREATE TABLE `wish` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`name` varchar(256) NOT NULL,
	`price` bigint NOT NULL,
	`currency` enum('DKK','EUR','USD','GBP') NOT NULL DEFAULT 'DKK',
	`description` varchar(1024) NOT NULL,
	`image_url` varchar(512) NOT NULL,
	`updated_at` datetime NOT NULL,
	`wishlist_id` varchar(255) NOT NULL);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_public` boolean NOT NULL DEFAULT true);
--> statement-breakpoint
CREATE TABLE `wishlist_on_users` (
	`wishlist_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`wishlist_role` enum('EDITABLE','INTERACTABLE','VIEWABLE') NOT NULL DEFAULT 'VIEWABLE',
	`updated_at` datetime NOT NULL);
--> statement-breakpoint
ALTER TABLE `user_info` DROP FOREIGN KEY `user_info_user_id_auth_user_id_fk`;
ALTER TABLE `family` ADD FULLTEXT INDEX `fulltext`(`name`);

