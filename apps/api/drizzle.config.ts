import { defineConfig } from 'drizzle-kit';

import { parseEnv } from './src/config/env';

const { DATABASE_URL } = parseEnv(process.env);

// `drizzle-kit generate` needs no connection; `drizzle-kit migrate` fails without DATABASE_URL.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/adapters/postgres/schema.ts',
  out: './drizzle',
  ...(DATABASE_URL === undefined ? {} : { dbCredentials: { url: DATABASE_URL } }),
});
