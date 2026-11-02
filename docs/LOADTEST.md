# Load tests

Numbers belong in this document, measured and not estimated. Every row names the scenario, the load,
the result, the machine and the commit it was measured at.

## Running

1. Start the API: `pnpm dev` (or the built version with `pnpm build`, then `pnpm --filter @o3/api start`).
2. In a second terminal: `pnpm load`. Docker must be running; k6 comes as a container.
3. Adjust load and duration: `RATE=2000 DURATION=60s pnpm load`. The target URL is `BASE_URL`
   (default: `http://host.docker.internal:3000`).

The scenario `load/smoke.js` holds a constant request rate on `/health` and aborts if more than 1 % of
the requests fail or the 95th percentile of the response time is above 200 ms. It is the template for
your own scenarios (purchase endpoint, queue, rate limiter).

## Results

The template ships no numbers: they would depend on a machine and on a service that a new project does
not have. Every project records its own measurements here, with the machine (processor, cores, memory,
operating system, Node version) it was measured on, and the commit. `GET /health` is only a probe that
the scaffold runs; it is not capacity evidence, because it touches neither a database nor a queue.

| Scenario | Load (req/s) | achieved (req/s) | dropped | p95 (ms) | Error rate | Machine | Commit |
| -------- | ------------ | ---------------- | ------- | -------- | ---------- | ------- | ------ |

## Provoking failures

A load without a failure shows only the good case. Trigger at least one failure during the run and
note what happens:

- Stop the project's database or cache and start it again.
- Kill a worker in the middle of a job.
- Send the same request twice (idempotency).

For every failure, write into the project's README: what broke, why, and what was changed.
