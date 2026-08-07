export type GoogleBooksErrorCode =
  | "not_found"
  | "rate_limited"
  | "timeout"
  | "network"
  | "bad_response"
  | "upstream"
  | "invalid_query";

export class GoogleBooksError extends Error {
  readonly code: GoogleBooksErrorCode;
  readonly status: number | null;

  constructor(
    code: GoogleBooksErrorCode,
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = "GoogleBooksError";
    this.code = code;
    this.status = status;
  }
}

export function googleBooksErrorFromHttpStatus(status: number): GoogleBooksError {
  if (status === 404) {
    return new GoogleBooksError(
      "not_found",
      "Google Books resource was not found",
      status,
    );
  }
  if (status === 429) {
    return new GoogleBooksError(
      "rate_limited",
      "Google Books rate limit exceeded",
      status,
    );
  }
  return new GoogleBooksError(
    "upstream",
    `Google Books request failed with status ${status}`,
    status,
  );
}

export function googleBooksErrorFromUnknown(error: unknown): GoogleBooksError {
  if (error instanceof GoogleBooksError) return error;

  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return new GoogleBooksError("timeout", "Google Books request timed out");
    }
  }

  return new GoogleBooksError("network", "Google Books request failed");
}
