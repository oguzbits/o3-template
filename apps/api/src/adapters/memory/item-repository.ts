import type { Item } from '@o3/shared';

import type { ItemRepository } from '../../core/item-repository';

function byAge(a: Item, b: Item): number {
  return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
}

/** For tests and local development. State lives in the process and is gone on restart. */
export function createMemoryItemRepository(): ItemRepository {
  const items = new Map<string, Item>();
  return {
    create: async (item) => {
      items.set(item.id, { ...item });
    },
    get: async (id) => {
      const found = items.get(id);
      return found === undefined ? null : { ...found };
    },
    list: async () => [...items.values()].sort(byAge).map((item) => ({ ...item })),
    remove: async (id) => items.delete(id),
  };
}
