CREATE TABLE `auth_token` (
	`id` varchar(128) NOT NULL,
	`type` enum('VALIDATE EMAIL','PASSWORD RESET') NOT NULL,
	`expires` bigint NOT NULL,
	`user_id` varchar(128) NOT NULL,
	CONSTRAINT `auth_token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `email_verification_token`;--> statement-breakpoint
DROP TABLE `password_reset_token`;