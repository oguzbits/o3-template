import { API_ERROR, ApiErrorSchema } from '@o3/shared';
import { describe, expect, it } from 'vitest';

import { createApp } from './app';
import { HTTP_STATUS } from './http-status';
import { createLogger } from './logger';

function makeApp() {
  const lines: string[] = [];
  const app = createApp({ log: createLogger((line) => lines.push(line)) });
  return { app, lines };
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

  it('logs one line per request without query or body content', async () => {
    const { app, lines } = makeApp();

    await app.request('/health?token=private-value');

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('"status":200');
    expect(lines[0]).not.toContain('private-value');
  });
});

describe('errors', () => {
  it('answers NOT_FOUND with the error contract for an unknown route', async () => {
    const { app } = makeApp();

    const res = await app.request('/nope');

    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(ApiErrorSchema.parse(await res.json()).code).toBe(API_ERROR.NOT_FOUND);
  });
});
