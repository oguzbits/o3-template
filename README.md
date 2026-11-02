# o3-template

Template für Backend-Projekte: ein kleiner, anbieterneutraler Kern mit strengen, automatisch
geprüften Regeln, Regeln für Coding-Agenten, lokalem Postgres und AWS-Emulator (Floci) und einem
Lasttest-Gerüst. Jedes neue Projekt startet damit auf demselben Qualitätsniveau.

## Schnellstart

Voraussetzungen: Node 24 (siehe `.nvmrc`), pnpm, Docker.

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # API auf http://localhost:3000
pnpm check          # Typen, Lint, Architektur, toter Code, Duplikate, Audits
pnpm test
pnpm db:up          # Postgres und Floci lokal starten
pnpm load           # Lasttest mit k6 (Docker), die API muss laufen
```

## Struktur

| Pfad                           | Inhalt                                                                 |
| ------------------------------ | ---------------------------------------------------------------------- |
| `packages/shared`              | Zod-Verträge, abgeleitete Typen, Konstanten. Keine Logik.              |
| `apps/api/src/core`            | Reine Fachlogik und die Ports (Interfaces) für alles Äußere.           |
| `apps/api/src/adapters`        | Umsetzungen der Ports. Heute nur Speicher, später Postgres, Queue, S3. |
| `apps/api/src/routes`          | Dünne HTTP-Schicht: Eingabe prüfen, Kern aufrufen, Antwort formen.     |
| `load/`                        | k6-Szenarien. Zahlen kommen nach [docs/LOADTEST.md](docs/LOADTEST.md). |
| `scripts/audit`                | Prüfungen für Magic Strings und Dokumentation.                         |
| `.claude`, `.husky`, `.github` | Hooks für Coding-Agenten, Git-Hooks und CI.                            |

Das Beispiel-Feature (`items`) zeigt das Muster einmal vollständig: Vertrag, reine Logik, Port,
Adapter mit Contract-Test, Route mit Test.

## Was geprüft wird

| Prüfung       | Befehl                   | Zweck                                                     |
| ------------- | ------------------------ | --------------------------------------------------------- |
| Typen         | `pnpm typecheck`         | TypeScript strict                                         |
| Lint          | `pnpm lint`              | ESLint mit Regeln gegen `any`, stille Fehler, Roh-Strings |
| Architektur   | `pnpm depcruise`         | Schichten und Importrichtungen                            |
| Toter Code    | `pnpm knip`              | Ungenutzte Dateien und Abhängigkeiten                     |
| Duplikate     | `pnpm audit:duplication` | Schwelle 2 %                                              |
| Magic Strings | `pnpm audit:magic`       | Konstanten aus `as const`-Wörterbüchern statt Roh-Strings |
| Dokumentation | `pnpm audit:docs`        | Links, Skriptnamen und Pfade in Markdown                  |

`pnpm check` führt alles aus. Husky ruft es vor jedem Commit auf, die Tests vor jedem Push. In der
CI laufen zusätzlich Semgrep, Trivy mit SBOM und `pnpm audit`.

## Mit Coding-Agenten arbeiten

Die Regeln stehen in [AGENTS.md](AGENTS.md); `CLAUDE.md` verweist nur darauf. Die Hooks in `.claude`
blockieren Force-Pushes, `--no-verify` und den Zugriff auf `.env`-Dateien. Der Stop-Hook lässt einen
Agenten erst fertig werden, wenn `pnpm check` besteht.

## Pflege

Offene Arbeit, geplante Bausteine und mögliche Presets (Web, NestJS, DynamoDB) stehen in
[docs/BACKLOG.md](docs/BACKLOG.md). Die Entscheidungen und ihre Gründe stehen in [docs/PLAN.md](docs/PLAN.md).
