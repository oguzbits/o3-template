import { API_ERROR, HealthSchema } from '@o3/shared';
import { Hono } from 'hono';

import type { AppDeps } from './app-deps';
import type { AppEnv } from './app-env';
import { errorBody } from './error-mapping';
import { HTTP_STATUS } from './http-status';
import { requestContext } from './middleware/request-context';

export function createApp(deps: AppDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use('*', requestContext(deps.log));

  app.get('/health', (c) => c.json(HealthSchema.parse({ status: 'ok' })));

  app.notFound((c) =>
    c.json(errorBody(API_ERROR.NOT_FOUND, c.get('requestId')), HTTP_STATUS.NOT_FOUND)
  );
  app.onError((error, c) => {
    // The class name is enough to find the cause; the message may carry content.
    deps.log.error('unhandled', { requestId: c.get('requestId'), errorName: error.name });
    return c.json(errorBody(API_ERROR.INTERNAL, c.get('requestId')), HTTP_STATUS.INTERNAL);
  });

  return app;
}
