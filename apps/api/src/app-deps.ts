import type { ItemRepository } from './core/item-repository';
import type { Logger } from './logger';

/** Everything the app needs from outside. Tests pass fakes, `index.ts` passes the real ones. */
export interface AppDeps {
  items: ItemRepository;
  log: Logger;
  now: () => Date;
  newId: () => string;
}
