import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const itemsTable = pgTable('items', {
  id: uuid().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull(),
});
