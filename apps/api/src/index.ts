import { randomUUID } from 'node:crypto';

import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { createMemoryItemRepository } from './adapters/memory/item-repository';
import { createPostgresItemRepository } from './adapters/postgres/item-repository';
import { createApp } from './app';
import { parseEnv } from './config/env';
import { createLogger, stdoutSink } from './logger';
import { registerShutdown } from './shutdown';

const env = parseEnv(process.env);
const log = createLogger(stdoutSink);

// Migrations are applied with `pnpm db:migrate`, never implicitly at start.
const pool =
  env.DATABASE_URL === undefined ? null : new Pool({ connectionString: env.DATABASE_URL });
const items =
  pool === null
    ? createMemoryItemRepository()
    : createPostgresItemRepository(drizzle({ client: pool }));

const app = createApp({
  items,
  log,
  now: () => new Date(),
  newId: randomUUID,
});

const server = serve({ fetch: app.fetch, port: env.PORT }, () =>
  log.info('listening', { port: env.PORT })
);
registerShutdown(server, log, () => pool?.end() ?? Promise.resolve());
