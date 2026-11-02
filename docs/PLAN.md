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
| Lokale Cloud  | Floci (AWS-Emulator), Postgres                   | Kein Konto und keine Kosten; Floci ist kein vollständiger Ersatz für echtes AWS    |
| Lasttests     | k6                                               | Skripte in `load/`, Zahlen in [LOADTEST.md](LOADTEST.md)                           |

## Grenzen des Kerns

- Das Frontend ist ein optionales Preset, kein Teil des Kerns.
- Austauschbar sind API-Framework, Datenbank und Queue. Austausch heißt: neuer Adapter, der den
  Contract-Test seines Ports besteht.
- Neue Varianten entstehen erst, wenn ein echtes Projekt sie braucht (Rule of Three).
