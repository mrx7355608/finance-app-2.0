CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`bought_price` integer NOT NULL,
	`sold_price` integer DEFAULT 0,
	`createdAt` text NOT NULL
);
