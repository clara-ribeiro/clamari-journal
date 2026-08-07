/** Minimal Google Books wire shapes used by the normalizer. */

export type GoogleBooksRawIdentifier = {
  type?: string;
  identifier?: string;
};

export type GoogleBooksRawImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
};

export type GoogleBooksRawVolumeInfo = {
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  industryIdentifiers?: GoogleBooksRawIdentifier[];
  imageLinks?: GoogleBooksRawImageLinks;
};

export type GoogleBooksRawVolume = {
  id?: string;
  volumeInfo?: GoogleBooksRawVolumeInfo;
};

export type GoogleBooksRawSearchResponse = {
  kind?: string;
  totalItems?: number;
  items?: GoogleBooksRawVolume[];
};
