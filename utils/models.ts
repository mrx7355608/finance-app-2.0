import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const recordsTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  image: text().notNull(),
  bought_price: int().notNull(),
  sold_price: int().default(0),
  createdAt: text().notNull(),
});
