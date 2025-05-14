PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT '2025-03-22T22:37:05.224Z' NOT NULL,
	`updated_at` text DEFAULT '2025-03-22T22:37:05.225Z' NOT NULL,
	`record_id` integer NOT NULL,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "name", "amount", "created_at", "updated_at", "record_id") SELECT "id", "name", "amount", "created_at", "updated_at", "record_id" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `records` ADD `updatedAt` text NOT NULL;