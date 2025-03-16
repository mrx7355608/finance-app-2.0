import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const recordsTable = sqliteTable("records", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  image: text().notNull(),
  bought_price: int().notNull(),
  sold_price: int().default(0),
  createdAt: text().notNull(),
});

export const expensesTable = sqliteTable("expenses", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  amount: int("amount").notNull(), // assuming integers like cents or whole numbers
  createdAt: text("created_at").notNull().default(new Date().toISOString()),

  // Foreign key to the records table
  recordId: int("record_id")
    .references(() => recordsTable.id)
    .notNull(),
});
