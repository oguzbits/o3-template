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

| Szenario | Last (req/s) | p95 (ms) | Fehlerrate | Maschine | Commit |
| -------- | ------------ | -------- | ---------- | -------- | ------ |
| smoke    | offen        | offen    | offen      | offen    | offen  |

## Ausfälle provozieren

Eine Last ohne Ausfall zeigt nur den Gutfall. Währenddessen mindestens einen Ausfall auslösen und
notieren, was passiert:

- Datenbank oder Cache stoppen (`docker compose stop db`) und wieder starten.
- Einen Worker mitten im Job beenden.
- Dieselbe Anfrage doppelt schicken (Idempotenz).

Pro Ausfall in die README des Projekts: Was ist kaputtgegangen, warum, und was wurde geändert.
