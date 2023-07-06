ALTER TABLE `user_info` DROP PRIMARY KEY--> statement-breakpoint
ALTER TABLE `user_info` MODIFY COLUMN `description` varchar(1024) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_info` ADD CONSTRAINT `user_info_id_auth_user_id_fk` FOREIGN KEY (`id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;