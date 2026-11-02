import { describe, expect, it } from 'vitest';

import { createLogger } from './logger';

describe('createLogger', () => {
  it('writes one JSON line per event with the level and the fields', () => {
    const lines: string[] = [];
    const log = createLogger((line) => lines.push(line));

    log.info('request', { status: 200, durationMs: 3 });
    log.error('boom');

    expect(lines.map((line) => JSON.parse(line))).toEqual([
      { level: 'info', event: 'request', status: 200, durationMs: 3 },
      { level: 'error', event: 'boom' },
    ]);
  });
});
