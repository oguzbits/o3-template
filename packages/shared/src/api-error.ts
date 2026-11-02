import { z } from 'zod';

/** Codes of every error the API answers with. Clients map each code to their own message. */
export const API_ERROR = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL: 'INTERNAL',
} as const;

export const ApiErrorCodeSchema = z.enum(API_ERROR);

export const ApiErrorSchema = z.object({
  code: ApiErrorCodeSchema,
  /** Optional hint, for example the name of the field that was rejected. Never user content. */
  detail: z.string().optional(),
  /** The ID of the request (header `X-Request-Id`), so a reported error can be found in the logs. */
  requestId: z.string().optional(),
});

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
