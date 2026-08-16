const LOCAL_ORIGIN = "http://localhost:3000";

/**
 * Canonical site origin for metadataBase, sitemap, and robots.
 * Prefers `SITE_URL` (production domain). Falls back to Vercel's production
 * host. Never uses `VERCEL_URL` so Preview deployments do not become canonical.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit);
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) {
    return new URL(
      productionHost.startsWith("http")
        ? productionHost
        : `https://${productionHost}`,
    );
  }

  return new URL(LOCAL_ORIGIN);
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

/** Preview deployments stay out of the index; local and production stay in. */
export function allowSearchIndexing(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";
  return true;
}
