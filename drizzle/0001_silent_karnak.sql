ALTER TABLE `auth_user` ADD `email` varchar(255);--> statement-breakpoint
ALTER TABLE `auth_user` ADD `email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_user` ADD `user_info_set` boolean DEFAULT false NOT NULL;