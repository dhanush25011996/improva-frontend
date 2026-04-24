export interface ApiEnvelope<T> {
  success: boolean;
  api_name: string;
  timestamp: string;
  data: T;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly api_name?: string;

  constructor(message: string, status: number, api_name?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.api_name = api_name;
  }
}

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api/v1";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  signal?: AbortSignal;
}

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = "GET", body, signal } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let payload: ApiEnvelope<T> | { data?: { error?: string } } | null = null;
  try {
    payload = (await res.json()) as ApiEnvelope<T>;
  } catch {
    /* non-JSON body - ignore */
  }

  if (!res.ok || !payload || !(payload as ApiEnvelope<T>).success) {
    const errMessage =
      (payload as { data?: { error?: string } } | null)?.data?.error ??
      `Request failed with status ${res.status}`;
    const apiName = (payload as ApiEnvelope<T> | null)?.api_name;
    throw new ApiError(errMessage, res.status, apiName);
  }

  return (payload as ApiEnvelope<T>).data;
};

export const api = {
  get: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PATCH", body, signal }),
};
