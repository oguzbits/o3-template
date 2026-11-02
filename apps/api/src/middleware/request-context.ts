import { randomUUID } from 'node:crypto';

import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';

import type { AppEnv } from '../app-env';
import type { Logger } from '../logger';

// A caller may send its own ID to follow a request through several services; anything else is replaced.
const SAFE_REQUEST_ID = /^[\w-]{1,64}$/;

function resolveRequestId(incoming: string | undefined): string {
  return incoming !== undefined && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
}

/** Sets `requestId` on the context and the `X-Request-Id` header, and logs one line per request. */
export function requestContext(log: Logger): MiddlewareHandler<AppEnv> {
  return createMiddleware<AppEnv>(async (c, next) => {
    const requestId = resolveRequestId(c.req.header('x-request-id'));
    c.set('requestId', requestId);
    c.header('X-Request-Id', requestId);
    const started = Date.now();
    await next();
    log.info('request', {
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: Date.now() - started,
    });
  });
}
