import Link from "next/link";
import { listBooks, getBookStats } from "@/application/use-cases/books";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100vh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "72rem",
  mx: "auto",
});

const Back = styled(Link, {
  color: "$textMuted",
  fontSize: "$sm",
  display: "inline-block",
  marginBottom: "$lg",
  "&:hover": { color: "$accent" },
});

const Title = styled("h1", {
  fontSize: "$2xl",
  marginBottom: "$sm",
});

const Summary = styled("p", {
  color: "$textMuted",
  marginBottom: "$xl",
});

const Empty = styled("p", {
  color: "$textMuted",
  padding: "$xl",
  border: "1px dashed $border",
  borderRadius: "$lg",
  textAlign: "center",
});

export default function BooksPage() {
  const books = listBooks();
  const stats = getBookStats();

  return (
    <Page>
      <Back href="/">← Home</Back>
      <Title>Books</Title>
      <Summary>
        {stats.finished} finished · {stats.reading} in progress · {stats.total}{" "}
        total
      </Summary>
      {books.length === 0 ? (
        <Empty>
          No books yet. Add entries in <code>src/data/books.json</code> or via
          the search script.
        </Empty>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.slug}>
              <Link href={`/books/${book.slug}`}>
                {book.title ?? book.slug}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
