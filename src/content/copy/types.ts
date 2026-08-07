export type CatalogCopy = {
  titleId: string;
  title: string;
  description: string;
  backLabel: string;
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
  backLabel: string;
  backHref: string;
  listAriaLabel: string;
  empty: string;
  hero: MediumCatalogHeroCopy;
};
