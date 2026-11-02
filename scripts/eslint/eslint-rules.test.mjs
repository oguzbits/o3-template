import path from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// These tests run the project's real eslint.config.mjs, so removing a rule from the config turns
// the matching "reports" test red.
const ROOT = path.resolve(import.meta.dirname, '../..');
const eslint = new ESLint({ cwd: ROOT });

const SAFETY_RULE = 'local/require-safety-comment';
const MOCK_MESSAGE = 'no-module-mocking';
const UNKNOWN_PARAM_MESSAGE = 'no-unknown-parameters';

async function lint(code) {
  const [result] = await eslint.lintText(code, {
    filePath: path.join(ROOT, 'apps/api/src/example.ts'),
  });
  return result.messages;
}

async function reported(code, marker) {
  const messages = await lint(code);
  return messages.filter((m) => m.ruleId === marker || m.message.startsWith(marker));
}

describe('local/require-safety-comment', () => {
  const flagged = (code) => reported(code, SAFETY_RULE);

  it('reports an assertion without a justification', async () => {
    expect(await flagged('export const a = JSON.parse("1") as number;\n')).toHaveLength(1);
    expect(await flagged('export const a = <number>JSON.parse("1");\n')).toHaveLength(1);
  });

  it('reports an empty or unrelated comment', async () => {
    expect(await flagged('// SAFETY:\nexport const a = JSON.parse("1") as number;\n')).toHaveLength(
      1
    );
    expect(
      await flagged('// it is a number\nexport const a = JSON.parse("1") as number;\n')
    ).toHaveLength(1);
  });

  it('accepts a SAFETY comment on the line above or on the same line', async () => {
    expect(
      await flagged(
        '// SAFETY: the config file only holds numbers\nexport const a = JSON.parse("1") as number;\n'
      )
    ).toHaveLength(0);
    expect(
      await flagged('export const a = JSON.parse("1") as number; // SAFETY: only numbers here\n')
    ).toHaveLength(0);
  });

  it('accepts as const', async () => {
    expect(await flagged('export const a = { b: 1 } as const;\n')).toHaveLength(0);
  });
});

describe('no-module-mocking', () => {
  const flagged = (code) => reported(code, MOCK_MESSAGE);

  it('reports module mocks of Vitest and Jest', async () => {
    expect(await flagged('vi.mock("./x");\n')).toHaveLength(1);
    expect(await flagged('vi.doMock("./x");\n')).toHaveLength(1);
    expect(await flagged('jest.mock("./x");\n')).toHaveLength(1);
  });

  it('allows spies and function mocks', async () => {
    expect(await flagged('export const f = vi.fn();\nvi.spyOn(console, "log");\n')).toHaveLength(0);
  });
});

describe('no-unknown-parameters', () => {
  const flagged = (code) => reported(code, UNKNOWN_PARAM_MESSAGE);

  it('reports unknown as a parameter type', async () => {
    expect(await flagged('export function f(a: unknown) { return a; }\n')).toHaveLength(1);
    expect(await flagged('export const f = (a: unknown) => a;\n')).toHaveLength(1);
    expect(await flagged('export interface P { run(payload: unknown): void }\n')).toHaveLength(1);
    expect(await flagged('export type H = (payload: unknown) => void;\n')).toHaveLength(1);
  });

  it('allows the cause convention, type predicates, catch clauses and typed parameters', async () => {
    expect(
      await flagged(
        'export class E extends Error { constructor(m: string, cause: unknown) { super(m, { cause }); } }\n'
      )
    ).toHaveLength(0);
    expect(
      await flagged(
        'export function isText(a: unknown): a is string { return typeof a === "string"; }\n'
      )
    ).toHaveLength(0);
    expect(
      await flagged(
        'export function f() { try { return 1; } catch (error: unknown) { throw error; } }\n'
      )
    ).toHaveLength(0);
    expect(await flagged('export function f(a: string) { return a; }\n')).toHaveLength(0);
  });
});
