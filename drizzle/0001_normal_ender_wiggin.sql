CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT '2025-03-16T01:34:11.325Z' NOT NULL,
	`record_id` integer NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
