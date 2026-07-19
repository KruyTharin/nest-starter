import type { ErrorCode } from '@/core/responses/error-codes';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: ErrorCode;
  message: string | string[];
  error?: string;
  path: string;
  timestamp: string;
}
