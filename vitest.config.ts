import path from 'node:path';

import { configDefaults, defineConfig } from 'vitest/config';

const setupFiles = [path.resolve(import.meta.dirname, 'vitest.setup.ts')];

export default defineConfig({
  test: {
    projects: [
      { test: { name: 'shared', root: './packages/shared', environment: 'node', setupFiles } },
      {
        test: {
          name: 'api',
          root: './apps/api',
          environment: 'node',
          setupFiles,
          exclude: [...configDefaults.exclude, '**/*.db.test.ts'],
        },
      },
      // Needs a real Postgres (`pnpm db:up`); run with `pnpm test:db`, not part of `pnpm test`.
      {
        test: {
          name: 'db',
          root: './apps/api',
          environment: 'node',
          include: ['src/**/*.db.test.ts'],
        },
      },
      { test: { name: 'hooks', root: './.claude/hooks', environment: 'node', setupFiles } },
      { test: { name: 'scripts', root: './scripts', environment: 'node', setupFiles } },
    ],
  },
});
