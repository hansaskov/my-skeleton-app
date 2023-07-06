ALTER TABLE `user_info` DROP FOREIGN KEY `user_info_id_auth_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `auth_user` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_info` ADD PRIMARY KEY (`id`);--> statement-breakpoint
ALTER TABLE `user_info` ADD `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_info` ADD CONSTRAINT `user_info_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;