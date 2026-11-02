import { describe, expect, it } from 'vitest';

// Closed high port on localhost: without the guard this fails with a connection error, with the guard
// MSW rejects the request first. The message tells the two apart.
const UNMOCKED_URL = 'https://127.0.0.1:59999/unmocked';

describe('network guard (vitest.setup.ts)', () => {
  it('rejects a request that no handler covers', async () => {
    const outcome = await fetch(UNMOCKED_URL).then(
      () => 'resolved',
      (error: Error) => `${error.message} ${String(error.cause ?? '')}`
    );

    expect(outcome).toMatch(/\[MSW\]/);
  });
});
