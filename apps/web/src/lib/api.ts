import { webEnv } from "./env";

interface ApiRequestOptions extends RequestInit {
  isFormData?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { isFormData, headers, ...rest } = options;

  const response = await fetch(`${webEnv.apiUrl}${endpoint}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
};