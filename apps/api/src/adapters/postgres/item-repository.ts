import { asc, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { ItemRepository } from '../../core/item-repository';
import { itemsTable } from './schema';

/** Postgres adapter for the ItemRepository port. Errors from the driver propagate: no fallback. */
export function createPostgresItemRepository(db: NodePgDatabase): ItemRepository {
  return {
    create: async (item) => {
      await db
        .insert(itemsTable)
        .values({ id: item.id, title: item.title, createdAt: new Date(item.createdAt) });
    },
    get: async (id) => {
      const [row] = await db.select().from(itemsTable).where(eq(itemsTable.id, id));
      return row === undefined ? null : { ...row, createdAt: row.createdAt.toISOString() };
    },
    list: async () => {
      const rows = await db
        .select()
        .from(itemsTable)
        .orderBy(asc(itemsTable.createdAt), asc(itemsTable.id));
      return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
    },
    remove: async (id) => {
      const removed = await db.delete(itemsTable).where(eq(itemsTable.id, id)).returning();
      return removed.length > 0;
    },
  };
}
