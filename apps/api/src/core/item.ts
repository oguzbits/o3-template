import type { Item } from '@o3/shared';

interface NewItemContext {
  id: string;
  now: Date;
}

const WHITESPACE_RUN = /\s+/g;

/** Pure domain logic: no I/O, no clock, no random. The caller passes the id and the time. */
export function normalizeTitle(title: string): string {
  return title.trim().replace(WHITESPACE_RUN, ' ');
}

export function buildItem(title: string, context: NewItemContext): Item {
  return { id: context.id, title: normalizeTitle(title), createdAt: context.now.toISOString() };
}
