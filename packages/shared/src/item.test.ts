import { describe, expect, it } from 'vitest';

import { CreateItemSchema, ITEM_LIMITS, ItemSchema } from './item';

const VALID_ITEM = {
  id: '3f1c2b0e-8f55-4c1e-9a8f-6b1f3d2e7a10',
  title: 'First item',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('ItemSchema', () => {
  it('accepts a valid item', () => {
    expect(ItemSchema.parse(VALID_ITEM)).toEqual(VALID_ITEM);
  });

  it('rejects an empty or too long title', () => {
    expect(ItemSchema.safeParse({ ...VALID_ITEM, title: '   ' }).success).toBe(false);
    const tooLong = 'x'.repeat(ITEM_LIMITS.TITLE_MAX_CHARS + 1);
    expect(ItemSchema.safeParse({ ...VALID_ITEM, title: tooLong }).success).toBe(false);
  });

  it('rejects an id that is no UUID', () => {
    expect(ItemSchema.safeParse({ ...VALID_ITEM, id: 'nope' }).success).toBe(false);
  });
});

describe('CreateItemSchema', () => {
  it('takes only the title and trims it', () => {
    expect(CreateItemSchema.parse({ title: '  Hello  ' })).toEqual({ title: 'Hello' });
  });
});
