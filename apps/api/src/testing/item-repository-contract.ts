import { randomUUID } from 'node:crypto';

import type { Item } from '@o3/shared';
import { describe, expect, it } from 'vitest';

import type { ItemRepository } from '../core/item-repository';

function makeItem(title: string, createdAt: string): Item {
  return { id: randomUUID(), title, createdAt };
}

/**
 * The behaviour every ItemRepository adapter must show. Register it from the adapter's own test:
 * `itemRepositoryContract('name', () => createRepository())`. A new adapter is done when this passes.
 */
export function itemRepositoryContract(
  name: string,
  createRepository: () => ItemRepository | Promise<ItemRepository>
): void {
  describe(`${name} fulfils the ItemRepository contract`, () => {
    it('returns a created item by id', async () => {
      const repository = await createRepository();
      const item = makeItem('first', '2026-01-01T00:00:00.000Z');

      await repository.create(item);

      expect(await repository.get(item.id)).toEqual(item);
    });

    it('returns null for an unknown id', async () => {
      const repository = await createRepository();

      expect(await repository.get(randomUUID())).toBeNull();
    });

    it('lists items oldest first', async () => {
      const repository = await createRepository();
      const newer = makeItem('newer', '2026-01-02T00:00:00.000Z');
      const older = makeItem('older', '2026-01-01T00:00:00.000Z');

      await repository.create(newer);
      await repository.create(older);

      expect(await repository.list()).toEqual([older, newer]);
    });

    it('removes an item and reports whether it existed', async () => {
      const repository = await createRepository();
      const item = makeItem('gone soon', '2026-01-01T00:00:00.000Z');
      await repository.create(item);

      expect(await repository.remove(item.id)).toBe(true);
      expect(await repository.get(item.id)).toBeNull();
      expect(await repository.remove(item.id)).toBe(false);
    });
  });
}
