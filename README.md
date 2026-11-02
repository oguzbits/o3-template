# o3-template

Template for backend projects: a small, vendor-neutral core with strict, automatically checked rules,
rules for coding agents and a load-test scaffold. It deliberately ships no database and no example
feature. Every new project starts at the same quality level.

## Quick start

Requirements: Node 26 (see `.nvmrc`), pnpm; Docker only for the load test.

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # API on http://localhost:3000
pnpm check          # types, lint, architecture, dead code, duplicates, audits
pnpm test
pnpm load           # load test with k6 (Docker), the API must be running
```

## Structure

| Path                           | Content                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| `packages/shared`              | Zod contracts, inferred types, constants. No logic.                 |
| `apps/api`                     | Hono API with `/health`, request ID, logger, env parsing, shutdown. |
| `load/`                        | k6 scenarios. Numbers go to [docs/LOADTEST.md](docs/LOADTEST.md).   |
| `scripts/audit`                | Checks for magic strings and documentation.                         |
| `.claude`, `.husky`, `.github` | Hooks for coding agents, Git hooks and CI.                          |

A project creates the layers (`core`, `adapters`, `routes` under `apps/api/src`) when it needs them.
Their rules are in [AGENTS.md](AGENTS.md) and are enforced by `pnpm depcruise`.

## What is checked

| Check         | Command                  | Purpose                                                       |
| ------------- | ------------------------ | ------------------------------------------------------------- |
| Types         | `pnpm typecheck`         | TypeScript strict                                             |
| Lint          | `pnpm lint`              | ESLint with rules against `any`, silent errors, raw strings   |
| Architecture  | `pnpm depcruise`         | Layers and import directions                                  |
| Dead code     | `pnpm knip`              | Unused files and dependencies                                 |
| Duplicates    | `pnpm audit:duplication` | Threshold 2 %                                                 |
| Magic strings | `pnpm audit:magic`       | Constants from `as const` dictionaries instead of raw strings |
| Documentation | `pnpm audit:docs`        | Links, script names and paths in Markdown                     |

`pnpm check` runs everything. Husky runs it before every commit and the tests before every push. CI
adds Semgrep, Trivy with SBOM and `pnpm audit`.

## Working with coding agents

The rules are in [AGENTS.md](AGENTS.md); `CLAUDE.md` only points to it. The hooks in `.claude` block
force-pushes, `--no-verify` and access to `.env` files. The Stop hook lets an agent finish only when
`pnpm check` passes.

## Maintenance

Open work, planned building blocks and possible presets (Web, NestJS, DynamoDB) are in
[docs/BACKLOG.md](docs/BACKLOG.md). The decisions and their reasons are in [docs/PLAN.md](docs/PLAN.md).
