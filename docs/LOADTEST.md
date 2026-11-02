# Lasttests

Zahlen gehören in dieses Dokument, gemessen und nicht geschätzt. Jede Zeile nennt Szenario, Last,
Ergebnis, Maschine und den Commit, mit dem gemessen wurde.

## Ausführen

1. API starten: `pnpm dev` (oder den gebauten Stand mit `pnpm build` und danach `pnpm --filter @o3/api start`).
2. In einem zweiten Terminal: `pnpm load`. Docker muss laufen; k6 kommt als Container.
3. Last und Dauer anpassen: `RATE=2000 DURATION=60s pnpm load`. Die Ziel-URL steht in `BASE_URL`
   (Standard: `http://host.docker.internal:3000`).

Das Szenario `load/smoke.js` hält eine konstante Anfragerate auf `/health` und bricht ab, wenn mehr als
1 % der Anfragen fehlschlagen oder das 95. Perzentil der Antwortzeit über 200 ms liegt. Es ist die
Vorlage für eigene Szenarien (Kauf-Endpunkt, Queue, Rate Limiter).

## Ergebnisse

| Szenario | Last (req/s) | erreicht (req/s) | verworfen | p95 (ms) | Fehlerrate | Maschine | Commit  |
| -------- | ------------ | ---------------- | --------- | -------- | ---------- | -------- | ------- |
| smoke    | 500          | 500.0            | 0         | 1.04     | 0 %        | A        | f02ccc4 |
| smoke    | 2000         | 1995.2           | 139       | 0.53     | 0 %        | A        | f02ccc4 |
| smoke    | 5000         | 4980.1           | 603       | 0.66     | 0 %        | A        | f02ccc4 |
| smoke    | 10000        | 9938.2           | 1833      | 0.88     | 0 %        | A        | f02ccc4 |

Jede Zeile: 30 s, `GET /health`, gebauter Stand (`pnpm build`, `node apps/api/dist/index.js`), Anfrage-Log
nach stdout (Datei). "Verworfen" sind Iterationen, die k6 nicht rechtzeitig starten konnte (Ursache nicht
untersucht; k6 legt zusätzliche virtuelle Nutzer erst bei Bedarf an). Das Skript ist der Test des
Gerüsts, kein Kapazitätsnachweis: `/health` berührt weder Datenbank noch Queue.

Maschine A: Apple M4 (10 Kerne), 16 GiB, macOS 27.0.1, Node 26.12.0, Docker Desktop 29.8.2. API und k6
(Container, `grafana/k6:2.3.0`) laufen auf demselben Rechner und teilen sich die Kerne; der Weg vom
Container zum Host läuft durch das Netz von Docker Desktop. Auf Linux-CI-Runnern sind andere Zahlen zu
erwarten.

## Ausfälle provozieren

Eine Last ohne Ausfall zeigt nur den Gutfall. Währenddessen mindestens einen Ausfall auslösen und
notieren, was passiert:

- Datenbank oder Cache stoppen (`docker compose stop db`) und wieder starten.
- Einen Worker mitten im Job beenden.
- Dieselbe Anfrage doppelt schicken (Idempotenz).

Pro Ausfall in die README des Projekts: Was ist kaputtgegangen, warum, und was wurde geändert.
