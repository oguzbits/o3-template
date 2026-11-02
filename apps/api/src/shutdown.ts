import type { Logger } from './logger';

interface Closable {
  close(callback: (error?: Error) => void): unknown;
}

const SIGNALS = ['SIGTERM', 'SIGINT'] as const;

/**
 * Stops accepting connections on SIGTERM or SIGINT, waits for open requests, then runs `onClosed`
 * (release pools and the like) and exits. Any failure exits with code 1.
 */
export function registerShutdown(
  server: Closable,
  log: Logger,
  onClosed: () => Promise<unknown> = () => Promise.resolve()
): void {
  for (const signal of SIGNALS) {
    process.once(signal, () => {
      log.info('shutdown', { signal });
      server.close((error) => {
        onClosed().then(
          () => process.exit(error === undefined ? 0 : 1),
          () => process.exit(1)
        );
      });
    });
  }
}
