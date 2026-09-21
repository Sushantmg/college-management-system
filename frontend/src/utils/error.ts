import type { AxiosError } from "axios";

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const error = err as AxiosError<{ error?: string }>;
  return error?.response?.data?.error || error?.message || fallback;
}