import { API_ERROR, CreateItemSchema, ItemSchema } from '@o3/shared';
import { type Context, Hono } from 'hono';

import type { AppDeps } from '../app-deps';
import type { AppEnv } from '../app-env';
import { buildItem } from '../core/item';
import { errorBody } from '../error-mapping';
import { HTTP_STATUS } from '../http-status';

const IdSchema = ItemSchema.shape.id;

function notFound(c: Context<AppEnv>) {
  return c.json(errorBody(API_ERROR.NOT_FOUND, c.get('requestId')), HTTP_STATUS.NOT_FOUND);
}

/** Thin adapter: parse input with Zod, delegate to the core and the repository, format the answer. */
export function itemsRoutes(deps: AppDeps): Hono<AppEnv> {
  const routes = new Hono<AppEnv>();

  routes.get('/', async (c) => c.json(await deps.items.list()));

  routes.post('/', async (c) => {
    const parsed = CreateItemSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path.join('.');
      return c.json(
        errorBody(API_ERROR.INVALID_REQUEST, c.get('requestId'), field),
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const item = buildItem(parsed.data.title, { id: deps.newId(), now: deps.now() });
    await deps.items.create(item);
    return c.json(item, HTTP_STATUS.CREATED);
  });

  routes.get('/:id', async (c) => {
    const id = IdSchema.safeParse(c.req.param('id'));
    const item = id.success ? await deps.items.get(id.data) : null;
    return item === null ? notFound(c) : c.json(item);
  });

  routes.delete('/:id', async (c) => {
    const id = IdSchema.safeParse(c.req.param('id'));
    const removed = id.success ? await deps.items.remove(id.data) : false;
    return removed ? c.body(null, HTTP_STATUS.NO_CONTENT) : notFound(c);
  });

  return routes;
}
