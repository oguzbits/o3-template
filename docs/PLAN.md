# Plan und Entscheidungen

Kontext, kein Status. Was offen ist, steht in [BACKLOG.md](BACKLOG.md); den Rest zeigt git.

## Ziel

Ein Template für Backend-Projekte, das jedes neue Repo mit denselben Qualitätsschranken, Regeln für
Coding-Agenten und Lasttest-Gerüst startet. Der Kern ist klein und kennt keinen Anbieter. Alles, was
sich pro Projekt unterscheidet (Datenbank, Framework, Queue), liegt hinter Ports und Adaptern.

## Entscheidungen

| Bereich       | Wahl                                             | Grund                                                                              |
| ------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Sprache       | TypeScript strict                                | Ein Typsystem für Verträge, API und Clients                                        |
| Monorepo      | pnpm Workspaces                                  | Verträge liegen in `packages/shared` und werden von allen Apps genutzt             |
| API           | Hono                                             | Klein, schnell, typisierte Routen; ein Austausch betrifft nur die Routen           |
| Verträge      | Zod                                              | Eine Quelle für Validierung und Typen                                              |
| Tests         | Vitest, MSW                                      | MSW verhindert echte Netzwerkaufrufe in Tests                                      |
| Architektur   | dependency-cruiser, knip, jscpd, Magic-String-Audit | Regeln werden geprüft, nicht nur beschrieben                                     |
| Datenbank     | Postgres, Drizzle ORM (0.45, stabil), `pg`       | Generierte SQL-Migrationen; Drizzle 1.0 war bei der Wahl nur als `rc` verfügbar |
| Lokale Cloud  | Floci (AWS-Emulator), Postgres                   | Kein Konto und keine Kosten; Floci ist kein vollständiger Ersatz für echtes AWS    |
| Lasttests     | k6                                               | Skripte in `load/`, Zahlen in [LOADTEST.md](LOADTEST.md)                           |

## Grenzen des Kerns

- Das Frontend ist ein optionales Preset, kein Teil des Kerns.
- Austauschbar sind API-Framework, Datenbank und Queue. Austausch heißt: neuer Adapter, der den
  Contract-Test seines Ports besteht.
- Neue Varianten entstehen erst, wenn ein echtes Projekt sie braucht (Rule of Three).

## Datenbank

- Der Postgres-Adapter (`apps/api/src/adapters/postgres`) erfüllt denselben Contract-Test wie der
  Speicher-Adapter. `pnpm test:db` führt ihn gegen echtes Postgres aus (`pnpm db:up`, `DATABASE_URL`
  setzen) und wendet dafür die generierten Migrationen an. `pnpm test` bleibt ohne Datenbank.
- `DATABASE_URL` ist in `env.ts` optional. Fehlt sie, hält die API ihre Daten im Speicher (nur
  Entwicklung); mit `NODE_ENV=production` ist sie Pflicht.
- Schemaänderung: `schema.ts` ändern, `pnpm db:generate`, die erzeugte Migration committen. Die CI
  schlägt fehl, wenn eine Änderung keine Migration hat. Angewendet wird mit `pnpm db:migrate`, nie
  automatisch beim Start.
- Drizzle ist bewusst auf die stabile Linie 0.45 gesetzt. Wechsel auf 1.0 erst, wenn es als `latest`
  erscheint; die Migrationsordner der beiden Linien sind verschieden aufgebaut.
