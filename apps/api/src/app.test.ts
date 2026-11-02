import { API_ERROR, ApiErrorSchema, ItemSchema } from '@o3/shared';
import { describe, expect, it } from 'vitest';

import { createMemoryItemRepository } from './adapters/memory/item-repository';
import { createApp } from './app';
import { HTTP_STATUS } from './http-status';
import { createLogger } from './logger';

function makeApp() {
  const lines: string[] = [];
  let counter = 0;
  const app = createApp({
    items: createMemoryItemRepository(),
    log: createLogger((line) => lines.push(line)),
    now: () => new Date('2026-01-01T00:00:00.000Z'),
    newId: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`,
  });
  return { app, lines };
}

function post(app: ReturnType<typeof makeApp>['app'], body: string) {
  return app.request('/api/items', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('health and request ID', () => {
  it('answers /health', async () => {
    const { app } = makeApp();

    const res = await app.request('/health');

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('keeps a safe incoming request ID and replaces an unsafe one', async () => {
    const { app } = makeApp();

    const kept = await app.request('/health', { headers: { 'x-request-id': 'trace-123' } });
    const replaced = await app.request('/health', { headers: { 'x-request-id': 'bad id!' } });

    expect(kept.headers.get('x-request-id')).toBe('trace-123');
    expect(replaced.headers.get('x-request-id')).toMatch(/^[\w-]{1,64}$/);
    expect(replaced.headers.get('x-request-id')).not.toBe('bad id!');
  });

  it('logs one line per request without any request content', async () => {
    const { app, lines } = makeApp();

    await post(app, JSON.stringify({ title: 'private title' }));

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('"status":201');
    expect(lines[0]).not.toContain('private title');
  });
});

describe('items', () => {
  it('creates, reads, lists and deletes an item', async () => {
    const { app } = makeApp();

    const created = await post(app, JSON.stringify({ title: '  First   item ' }));
    const item = ItemSchema.parse(await created.json());
    const fetched = await app.request(`/api/items/${item.id}`);
    const listed = await app.request('/api/items');
    const deleted = await app.request(`/api/items/${item.id}`, { method: 'DELETE' });
    const gone = await app.request(`/api/items/${item.id}`);

    expect(created.status).toBe(HTTP_STATUS.CREATED);
    expect(item.title).toBe('First item');
    expect(await fetched.json()).toEqual(item);
    expect(await listed.json()).toEqual([item]);
    expect(deleted.status).toBe(HTTP_STATUS.NO_CONTENT);
    expect(gone.status).toBe(HTTP_STATUS.NOT_FOUND);
  });

  it('rejects an invalid body with INVALID_REQUEST and the field name', async () => {
    const { app } = makeApp();

    const res = await post(app, JSON.stringify({ title: '   ' }));
    const body = ApiErrorSchema.parse(await res.json());

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(body.code).toBe(API_ERROR.INVALID_REQUEST);
    expect(body.detail).toBe('title');
  });

  it('rejects a body that is no JSON', async () => {
    const { app } = makeApp();

    const res = await post(app, '{nope');

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it('answers NOT_FOUND for an ID that is no UUID and for an unknown route', async () => {
    const { app } = makeApp();

    const badId = await app.request('/api/items/not-a-uuid');
    const unknown = await app.request('/nope');

    expect(badId.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(ApiErrorSchema.parse(await badId.json()).code).toBe(API_ERROR.NOT_FOUND);
    expect(unknown.status).toBe(HTTP_STATUS.NOT_FOUND);
  });
});
