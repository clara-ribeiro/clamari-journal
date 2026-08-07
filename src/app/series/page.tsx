import {
  getSeriesPageSummary,
  listSeriesCatalogItems,
} from "@/application/use-cases/series";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { seriesCopy } from "@/content/copy";

export default function SeriesPage() {
  return (
    <MediumCatalogTemplate
      medium="series"
      copy={seriesCopy.list}
      summary={getSeriesPageSummary()}
      items={listSeriesCatalogItems()}
    />
  );
}
