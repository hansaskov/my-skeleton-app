CREATE TABLE `user_info` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`full_name` varchar(256) NOT NULL,
	`birthdate` datetime NOT NULL,
	`description` varchar(1024),
	`image_url` varchar(512));
