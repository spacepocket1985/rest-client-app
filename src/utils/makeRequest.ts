export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export type MethodType = (typeof Method)[keyof typeof Method];

interface RequestParams {
  method: MethodType;
  url: string;
  body?: unknown;
  headers?: HeadersInit;
}

export type SuccessResponse<T = unknown> = {
  status: number;
  result: T;
  error?: never;
  method: MethodType;
};

export type ErrorResponse = {
  status: number;
  result?: never;
  error: string;
  method: MethodType;
};

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export const makeRequest = async <T = unknown>({
  method,
  url,
  body = null,
  headers = {},
}: RequestParams): Promise<ApiResponse<T>> => {
  if (!url) return { status: 0, error: 'URL is required', method };

  try {
    const requestBody =
      method !== 'GET' && body ?
        typeof body === 'string' ?
          body
        : JSON.stringify(body)
      : null;
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
      },
      body: requestBody,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: response.status,
        error: data?.message || response.statusText,
        method,
      };
    }

    return {
      status: response.status,
      result: data as T,
      method,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      method,
    };
  }
};
