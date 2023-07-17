ALTER TABLE `families_on_users` ADD CONSTRAINT `families_on_users_user_id_family_id_unique` UNIQUE(`user_id`,`family_id`);--> statement-breakpoint
ALTER TABLE `user_info` ADD CONSTRAINT `user_info_user_id_unique` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `wish` ADD CONSTRAINT `wish_wishlist_id_unique` UNIQUE(`wishlist_id`);--> statement-breakpoint
ALTER TABLE `wishlist_on_users` ADD CONSTRAINT `wishlist_on_users_user_id_wishlist_id_unique` UNIQUE(`user_id`,`wishlist_id`);