CREATE TABLE `family_invitation` (
	`id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `family_invitation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `families_on_users` MODIFY COLUMN `family_role` enum('MODERATOR','MEMBER') NOT NULL;