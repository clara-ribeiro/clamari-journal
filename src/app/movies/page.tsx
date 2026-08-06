import {
  getMoviesPageSummary,
  listMovieCatalogItems,
} from "@/application/use-cases/movies";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { moviesCopy } from "@/content/copy";

export default function MoviesPage() {
  return (
    <MediumCatalogTemplate
      copy={moviesCopy.list}
      summary={getMoviesPageSummary()}
      items={listMovieCatalogItems()}
    />
  );
}
