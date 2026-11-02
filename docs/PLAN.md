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
| Lasttests     | k6                                               | Skripte in `load/`, Zahlen in [LOADTEST.md](LOADTEST.md)                           |

## Grenzen des Kerns

- Das Frontend ist ein optionales Preset, kein Teil des Kerns.
- Austauschbar sind API-Framework, Datenbank und Queue. Austausch heißt: neuer Adapter, der den
  Contract-Test seines Ports besteht.
- Neue Varianten entstehen erst, wenn ein echtes Projekt sie braucht (Rule of Three).
- Bewusst nicht im Kern: Datenbank, Beispiel-Feature und lokale Dienste (docker-compose). Ein neues
  Projekt kann SQL oder NoSQL wählen; der Port und sein Contract-Test entstehen mit dem ersten
  Adapter. Ein fertiger Postgres-Adapter mit Drizzle liegt als Referenz im geschlossenen Pull Request #2.
