export type CatalogSearchFilters = {
  status: string;
  year: number | null;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Parse catalog list `?status=` / `?year=` from Next.js searchParams. */
export function parseCatalogSearchParams(
  params: Record<string, string | string[] | undefined>,
): CatalogSearchFilters {
  const status = firstParam(params.status)?.trim() ?? "";
  const yearRaw = firstParam(params.year)?.trim();
  const year =
    yearRaw && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : null;

  return {
    status,
    year: year != null && Number.isFinite(year) ? year : null,
  };
}

export function catalogQueryString(filters: {
  status: string;
  year: number | null;
}): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.year != null) params.set("year", String(filters.year));
  const query = params.toString();
  return query ? `?${query}` : "";
}
