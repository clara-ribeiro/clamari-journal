export type TmdbErrorCode =
  | "not_configured"
  | "not_found"
  | "rate_limited"
  | "timeout"
  | "network"
  | "bad_response"
  | "upstream";

export class TmdbError extends Error {
  readonly code: TmdbErrorCode;
  readonly status: number | null;

  constructor(code: TmdbErrorCode, message: string, status: number | null = null) {
    super(message);
    this.name = "TmdbError";
    this.code = code;
    this.status = status;
  }
}

export function tmdbErrorFromHttpStatus(status: number): TmdbError {
  if (status === 404) {
    return new TmdbError("not_found", "TMDB resource was not found", status);
  }
  if (status === 429) {
    return new TmdbError(
      "rate_limited",
      "TMDB rate limit exceeded",
      status,
    );
  }
  if (status === 401 || status === 403) {
    return new TmdbError(
      "not_configured",
      "TMDB authentication failed",
      status,
    );
  }
  return new TmdbError(
    "upstream",
    `TMDB request failed with status ${status}`,
    status,
  );
}

export function tmdbErrorFromUnknown(error: unknown): TmdbError {
  if (error instanceof TmdbError) return error;

  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return new TmdbError("timeout", "TMDB request timed out");
    }
    if (error.message === "TMDB_ACCESS_TOKEN is not configured") {
      return new TmdbError("not_configured", error.message);
    }
  }

  return new TmdbError("network", "TMDB request failed");
}
