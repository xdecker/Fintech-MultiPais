const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  token?: string;
  isFile?: boolean;
  isBlob?: boolean;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export async function apiClient<T>(
  endpoint: string,
  method: HttpMethod,
  options?: ApiClientOptions
): Promise<T> {
  let url = `${API_URL}${endpoint}`;

  // query params
  if (options?.params) {
    const query = new URLSearchParams(
      Object.entries(options.params).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
        {}
      )
    );

    url += `?${query.toString()}`;
  }

  const token = options?.token ?? getAuthToken();

  const headers: Record<string, string> = {
    ...(options?.isFile ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: options?.data
      ? options.isFile
        ? (options.data as BodyInit)
        : JSON.stringify(options.data)
      : undefined,

    cache: "no-store",
  });

  // errores
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));

    const error: ApiErrorResponse = {
      message: json.message || res.statusText,
      error: json.error || "RequestError",
      statusCode: res.status,
    };

    throw error;
  }

  // ---------- blob ----------
  if (options?.isBlob) {
    const blob = await res.blob();
    return { blob } as unknown as T;
  }

  const contentType = res.headers.get("content-type");

  if (!contentType) {
    return null as T;
  }

  if (contentType.includes("application/json")) {
    const text = await res.text();
    return text ? JSON.parse(text) : (null as T);
  }

  return null as T;
}
