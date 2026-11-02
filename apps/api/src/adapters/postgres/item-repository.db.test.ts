import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { afterAll, beforeAll } from 'vitest';

import { parseEnv } from '../../config/env';
import { itemRepositoryContract } from '../../testing/item-repository-contract';
import { createPostgresItemRepository } from './item-repository';
import { itemsTable } from './schema';

const MIGRATIONS_FOLDER = new URL('../../../drizzle', import.meta.url).pathname;

const { DATABASE_URL } = parseEnv(process.env);
if (DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL is required for the db tests. Start the services: pnpm db:up');
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle({ client: pool });

// The generated migrations build the schema, so the contract also proves they work.
beforeAll(() => migrate(db, { migrationsFolder: MIGRATIONS_FOLDER }));
afterAll(() => pool.end());

itemRepositoryContract('postgres adapter', async () => {
  await db.delete(itemsTable);
  return createPostgresItemRepository(db);
});
