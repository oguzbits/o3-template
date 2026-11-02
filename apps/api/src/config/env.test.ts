import { describe, expect, it } from 'vitest';

import { parseEnv } from './env';

describe('parseEnv', () => {
  it('applies defaults', () => {
    expect(parseEnv({})).toEqual({ NODE_ENV: 'development', PORT: 3000 });
  });

  it('coerces the port from a string', () => {
    expect(parseEnv({ PORT: '8080' }).PORT).toBe(8080);
  });

  it('names the variable but never prints its value', () => {
    expect(() => parseEnv({ PORT: 'secret-value' })).toThrow(/^(?!.*secret-value).*PORT/s);
  });

  it('accepts an optional DATABASE_URL', () => {
    const url = 'postgres://o3:o3@localhost:54329/o3_test';
    expect(parseEnv({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
    expect(parseEnv({}).DATABASE_URL).toBeUndefined();
  });

  it('requires DATABASE_URL in production, without printing values', () => {
    expect(() => parseEnv({ NODE_ENV: 'production' })).toThrow(/DATABASE_URL/);
    expect(() => parseEnv({ DATABASE_URL: 'not a url, secret-value' })).toThrow(
      /^(?!.*secret-value).*DATABASE_URL/s
    );
  });
});
