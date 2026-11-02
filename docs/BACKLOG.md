# Backlog

Offene Arbeit am Template, grob in der Reihenfolge, in der ich sie angehen würde.

## Sofort

- [ ] Lizenz festlegen (steht noch keine im Repo; Entscheidung des Eigentümers).

## Backend-Bausteine

- [ ] Postgres-Adapter mit Drizzle und generierten Migrationen als Baustein (Vorlage: Branch `feat/postgres-adapter`), erst wenn ein Projekt ihn braucht.
- [ ] Job-Queue (pg-boss): Retries mit Backoff, Dead-Letter, idempotente Jobs, Test mit abgebrochenem Worker.
- [ ] Verteilter Rate Limiter (Token Bucket und Sliding Window), getestet mit mehreren Instanzen.
- [ ] Floci-Adapter für Objektspeicher (S3), Endpoint nur über `env.ts`.
- [ ] Migrationsregel Expand, Backfill, Contract als Beispiel mit Lasttest.

## Qualität und Betrieb

- [ ] Nächtlicher CI-Lauf: API starten, `load/`-Szenarien ausführen, Ergebnis als Artefakt ablegen.
- [ ] Ausfall-Skript: Cache oder Worker während des Lasttests beenden.
- [ ] Dockerfile und Deploy-Gerüst.
- [ ] Mutation-Tests (Stryker) wie in den Vorlage-Projekten.
- [ ] Wöchentlicher Canary: aus dem Template ein Testprojekt erzeugen und dort `pnpm check` laufen lassen.

## Presets (erst bei echtem Bedarf)

- [ ] Web-Preset (Vite, React, TanStack Query, shadcn) mit den UI-Regeln.
- [ ] NestJS statt Hono als API-Preset.
- [ ] DynamoDB statt Postgres als Datenbank-Preset (über Floci testbar, dann mit gepinntem Image-Tag).
