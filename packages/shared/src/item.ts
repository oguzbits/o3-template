import { z } from 'zod';

/** Example feature: the smallest contract that shows the pattern (schema, inferred type, limits). */
export const ITEM_LIMITS = {
  TITLE_MAX_CHARS: 200,
} as const;

export const ItemSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(ITEM_LIMITS.TITLE_MAX_CHARS),
  createdAt: z.iso.datetime(),
});

export const CreateItemSchema = ItemSchema.pick({ title: true });

export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
