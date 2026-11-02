import type { ApiError, ApiErrorCode } from '@o3/shared';

export function errorBody(code: ApiErrorCode, requestId: string, detail?: string): ApiError {
  return { code, detail, requestId };
}
