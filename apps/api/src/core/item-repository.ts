import type { Item } from '@o3/shared';

/**
 * Port of the example feature. The core only knows this interface; every adapter (memory today,
 * Postgres or DynamoDB later) must pass the same contract test (`testing/item-repository-contract.ts`).
 * Adapters throw on failure: no silent fallback.
 */
export interface ItemRepository {
  create(item: Item): Promise<void>;
  get(id: string): Promise<Item | null>;
  /** Oldest first; items created at the same instant are ordered by id. */
  list(): Promise<Item[]>;
  /** True when the item existed. */
  remove(id: string): Promise<boolean>;
}
