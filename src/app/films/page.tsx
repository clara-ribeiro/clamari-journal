import {
  getMoviesPageSummary,
  listMovieCatalogItems,
} from "@/application/use-cases/movies";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { filmsCopy } from "@/content/copy";

export default function FilmsPage() {
  return (
    <MediumCatalogTemplate
      medium="films"
      copy={filmsCopy.list}
      summary={getMoviesPageSummary()}
      items={listMovieCatalogItems()}
    />
  );
}
