import type { Logger } from './logger';

interface Closable {
  close(callback: (error?: Error) => void): unknown;
}

const SIGNALS = ['SIGTERM', 'SIGINT'] as const;

/** Stops accepting connections on SIGTERM or SIGINT and exits once open requests have finished. */
export function registerShutdown(server: Closable, log: Logger): void {
  for (const signal of SIGNALS) {
    process.once(signal, () => {
      log.info('shutdown', { signal });
      server.close((error) => process.exit(error === undefined ? 0 : 1));
    });
  }
}
