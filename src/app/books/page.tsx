import {
  getBooksPageSummary,
  listBookCatalogItems,
} from "@/application/use-cases/books";
import MediumCatalogTemplate from "@/components/templates/MediumCatalogTemplate";
import { booksCopy } from "@/content/copy";

export default function BooksPage() {
  return (
    <MediumCatalogTemplate
      medium="books"
      copy={booksCopy.list}
      summary={getBooksPageSummary()}
      items={listBookCatalogItems()}
    />
  );
}
