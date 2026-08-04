/**
 * Google Books API client (server-side).
 * GOOGLE_BOOKS_API_KEY is optional for low-volume public queries.
 */

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1";

async function googleBooksFetch<T>(path: string): Promise<T> {
  const url = new URL(`${GOOGLE_BOOKS_BASE_URL}${path}`);
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  if (key) {
    url.searchParams.set("key", key);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Google Books request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export type GoogleBooksVolume = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
  };
};

export type GoogleBooksSearchResponse = {
  kind: string;
  totalItems: number;
  items?: GoogleBooksVolume[];
};

export async function searchBooks(query: string) {
  const params = new URLSearchParams({
    q: query,
    maxResults: "20",
    printType: "books",
  });
  return googleBooksFetch<GoogleBooksSearchResponse>(`/volumes?${params}`);
}

export async function getBookById(id: string) {
  return googleBooksFetch<GoogleBooksVolume>(`/volumes/${id}`);
}
