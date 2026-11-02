import type { Logger } from './logger';

/** Everything the app needs from outside. Tests pass fakes, `index.ts` passes the real ones. */
export interface AppDeps {
  log: Logger;
}
