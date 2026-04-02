export type V2ApiClientOptions = {
  baseUrl?: string;
  headers?: HeadersInit;
};

export function createV2ApiClient({
  baseUrl = "/api/v2",
  headers,
}: V2ApiClientOptions = {}) {
  async function request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const json = await response.json().catch(() => null);
      throw new Error(json?.message || "V2 API request failed");
    }

    return (await response.json()) as T;
  }

  return { request };
}
