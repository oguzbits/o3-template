# Plan and decisions

Context, not status. What is open is in [BACKLOG.md](BACKLOG.md); git shows the rest.

## Goal

A template for backend projects that starts every new repo with the same quality gates, rules for
coding agents and load-test scaffold. The core is small and knows no vendor. Everything that differs
per project (database, framework, queue) sits behind ports and adapters.

## Decisions

| Area         | Choice                                              | Reason                                                                  |
| ------------ | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Language     | TypeScript strict                                   | One type system for contracts, API and clients                          |
| Monorepo     | pnpm workspaces                                     | Contracts live in `packages/shared` and are used by all apps            |
| API          | Hono                                                | Small, fast, typed routes; replacing it only affects the routes         |
| Contracts    | Zod                                                 | One source for validation and types                                     |
| Tests        | Vitest, MSW                                         | MSW prevents real network calls in tests                                |
| Architecture | dependency-cruiser, knip, jscpd, magic-string audit | Rules are checked, not just described                                   |
| Load tests   | k6                                                  | Scripts in `load/`, numbers in [LOADTEST.md](LOADTEST.md)               |

## Limits of the core

- The frontend is an optional preset, not part of the core.
- Replaceable are the API framework, the database and the queue. Replacing means: a new adapter that
  passes the contract test of its port.
- New variants appear only when a real project needs them (Rule of Three).
- Deliberately not in the core: a database, an example feature and local services (docker-compose). A
  new project can choose SQL or NoSQL; the port and its contract test appear with the first adapter. A
  complete Postgres adapter with Drizzle exists as a reference in the closed pull request #2.
