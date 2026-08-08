export type CatalogCopy = {
  titleId: string;
  title: string;
  description: string;
  listAriaLabel: string;
  empty: string;
  /** Shown when the collection has entries but filters/search match nothing */
  noResults: string;
  /** Visible count when exactly one item matches — `{total}` */
  summaryOne: string;
  /** Visible count when zero or many items match — `{total}` */
  summary: string;
};

export type MediumCatalogHeroCopy = {
  titleId: string;
  title: string;
  sentinelId: string;
  image: {
    src: string;
    alt: string;
  };
};

export type MediumCatalogCopy = {
  titleId: string;
  title: string;
  listAriaLabel: string;
  empty: string;
  /** Shown when the catalog has entries but filters/search match nothing */
  noResults: string;
  /** Placeholders filled from the visible (filtered) catalog set */
  summary: string;
  hero: MediumCatalogHeroCopy;
};
