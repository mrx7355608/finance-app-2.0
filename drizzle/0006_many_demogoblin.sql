PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT '2025-03-22T22:43:19.926Z' NOT NULL,
	`updated_at` text DEFAULT '2025-03-22T22:43:19.926Z' NOT NULL,
	`record_id` integer NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "name", "amount", "created_at", "updated_at", "record_id") SELECT "id", "name", "amount", "created_at", "updated_at", "record_id" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`images` text NOT NULL,
	`bought_price` integer NOT NULL,
	`sold_price` integer DEFAULT 0,
	`createdAt` text DEFAULT '2025-03-22T22:43:19.925Z' NOT NULL,
	`updatedAt` text DEFAULT '2025-03-22T22:43:19.925Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_records`("id", "name", "images", "bought_price", "sold_price", "createdAt", "updatedAt") SELECT "id", "name", "images", "bought_price", "sold_price", "createdAt", "updatedAt" FROM `records`;--> statement-breakpoint
DROP TABLE `records`;--> statement-breakpoint
ALTER TABLE `__new_records` RENAME TO `records`;