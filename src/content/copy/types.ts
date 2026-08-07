export type CatalogCopy = {
  titleId: string;
  title: string;
  description: string;
  listAriaLabel: string;
  empty: string;
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
  hero: MediumCatalogHeroCopy;
};
