# Backlog

Open work on the template, roughly in the order I would tackle it.

## Backend building blocks

- [ ] Postgres adapter with Drizzle and generated migrations as a building block (reference: the closed pull request #2 with adapter, migrations, `db` test project and CI job), only when a project needs it.
- [ ] Job queue (pg-boss): retries with backoff, dead letter, idempotent jobs, test with a killed worker.
- [ ] Distributed rate limiter (token bucket and sliding window), tested with several instances.
- [ ] Floci adapter for object storage (S3), endpoint only through `env.ts`.
- [ ] Migration rule expand, backfill, contract as an example with a load test.

## Quality and operations

- [ ] Nightly CI run: start the API, run the `load/` scenarios, store the result as an artifact.
- [ ] Failure script: stop a cache or worker during the load test.
- [ ] Dockerfile and deploy scaffold.
- [ ] Mutation tests (Stryker) as an optional building block, only once a project has domain logic in `core`: mutate only `core`, run nightly in CI with incremental mode and a minimum score, not in `pnpm check` and not in PR CI. First check that the Vitest runner works with the Vitest version in use.
- [ ] Weekly canary: generate a test project from the template and run `pnpm check` there.

## Presets (only on real demand)

- [ ] Web preset (Vite, React, TanStack Query, shadcn) with the UI rules.
- [ ] NestJS instead of Hono as an API preset.
- [ ] DynamoDB instead of Postgres as a database preset (testable through Floci, then with a pinned image tag).
