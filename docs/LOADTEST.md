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

Das Template liefert keine Zahlen mit: Sie hingen an einer Maschine und an einem Dienst, den ein neues
Projekt nicht hat. Jedes Projekt trägt hier seine eigenen Messungen ein, mit der Maschine
(Prozessor, Kerne, Arbeitsspeicher, Betriebssystem, Node-Version), auf der gemessen wurde, und dem
Commit. `GET /health` taugt nur als Probe, dass das Gerüst läuft; ein Kapazitätsnachweis ist es nicht,
weil es weder Datenbank noch Queue berührt.

| Szenario | Last (req/s) | erreicht (req/s) | verworfen | p95 (ms) | Fehlerrate | Maschine | Commit |
| -------- | ------------ | ---------------- | --------- | -------- | ---------- | -------- | ------ |

## Ausfälle provozieren

Eine Last ohne Ausfall zeigt nur den Gutfall. Währenddessen mindestens einen Ausfall auslösen und
notieren, was passiert:

- Datenbank oder Cache des Projekts stoppen und wieder starten.
- Einen Worker mitten im Job beenden.
- Dieselbe Anfrage doppelt schicken (Idempotenz).

Pro Ausfall in die README des Projekts: Was ist kaputtgegangen, warum, und was wurde geändert.
