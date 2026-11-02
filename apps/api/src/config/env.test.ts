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
});
