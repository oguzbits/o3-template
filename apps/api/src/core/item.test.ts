import { describe, expect, it } from 'vitest';

import { buildItem, normalizeTitle } from './item';

describe('normalizeTitle', () => {
  it('trims and collapses runs of whitespace', () => {
    expect(normalizeTitle('  a \t b\n\nc  ')).toBe('a b c');
  });
});

describe('buildItem', () => {
  it('takes id and time from the caller', () => {
    const item = buildItem(' Hello   world ', {
      id: '00000000-0000-4000-8000-000000000001',
      now: new Date('2026-01-01T12:00:00.000Z'),
    });

    expect(item).toEqual({
      id: '00000000-0000-4000-8000-000000000001',
      title: 'Hello world',
      createdAt: '2026-01-01T12:00:00.000Z',
    });
  });
});
