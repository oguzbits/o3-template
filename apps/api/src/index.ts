import { randomUUID } from 'node:crypto';

import { serve } from '@hono/node-server';

import { createMemoryItemRepository } from './adapters/memory/item-repository';
import { createApp } from './app';
import { parseEnv } from './config/env';
import { createLogger, stdoutSink } from './logger';
import { registerShutdown } from './shutdown';

const env = parseEnv(process.env);
const log = createLogger(stdoutSink);

const app = createApp({
  items: createMemoryItemRepository(),
  log,
  now: () => new Date(),
  newId: randomUUID,
});

const server = serve({ fetch: app.fetch, port: env.PORT }, () =>
  log.info('listening', { port: env.PORT })
);
registerShutdown(server, log);
