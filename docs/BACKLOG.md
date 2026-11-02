# Backlog

Offene Arbeit am Template, grob in der Reihenfolge, in der ich sie angehen würde.

## Backend-Bausteine

- [ ] Postgres-Adapter mit Drizzle und generierten Migrationen als Baustein (Vorlage: der geschlossene Pull Request #2 mit Adapter, Migrationen, `db`-Testprojekt und CI-Job), erst wenn ein Projekt ihn braucht.
- [ ] Job-Queue (pg-boss): Retries mit Backoff, Dead-Letter, idempotente Jobs, Test mit abgebrochenem Worker.
- [ ] Verteilter Rate Limiter (Token Bucket und Sliding Window), getestet mit mehreren Instanzen.
- [ ] Floci-Adapter für Objektspeicher (S3), Endpoint nur über `env.ts`.
- [ ] Migrationsregel Expand, Backfill, Contract als Beispiel mit Lasttest.

## Qualität und Betrieb

- [ ] Nächtlicher CI-Lauf: API starten, `load/`-Szenarien ausführen, Ergebnis als Artefakt ablegen.
- [ ] Ausfall-Skript: Cache oder Worker während des Lasttests beenden.
- [ ] Dockerfile und Deploy-Gerüst.
- [ ] Mutation-Tests (Stryker) als optionaler Baustein, erst wenn ein Projekt Fachlogik in `core` hat: nur `core` mutieren, nachts in der CI mit inkrementellem Modus und Mindestquote, nicht in `pnpm check` und nicht in der PR-CI. Vorher prüfen, ob der Vitest-Runner mit der eingesetzten Vitest-Version läuft.
- [ ] Wöchentlicher Canary: aus dem Template ein Testprojekt erzeugen und dort `pnpm check` laufen lassen.

## Presets (erst bei echtem Bedarf)

- [ ] Web-Preset (Vite, React, TanStack Query, shadcn) mit den UI-Regeln.
- [ ] NestJS statt Hono als API-Preset.
- [ ] DynamoDB statt Postgres als Datenbank-Preset (über Floci testbar, dann mit gepinntem Image-Tag).
