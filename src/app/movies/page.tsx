import Link from "next/link";
import { listMovies, getMovieStats } from "@/application/use-cases/movies";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100dvh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerContent",
  mx: "auto",
});

const Back = styled(Link, {
  color: "$loContrast",
  fontSize: "$body2",
  display: "inline-block",
  marginBottom: "$lg",
  "&:hover": { color: "$primary" },
});

const Title = styled("h1", {
  fontSize: "$h2",
  marginBottom: "$sm",
});

const Summary = styled("p", {
  color: "$loContrast",
  marginBottom: "$xl",
});

const List = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "$sm",
});

const Item = styled("li", {
  borderBottom: "1px solid $border",
  py: "$sm",
});

const ItemLink = styled(Link, {
  display: "flex",
  justifyContent: "space-between",
  gap: "$md",
  flexWrap: "wrap",
  "&:hover": { color: "$primary" },
});

const Meta = styled("span", {
  color: "$loContrast",
  fontSize: "$body2",
});

export default function MoviesPage() {
  const movies = listMovies();
  const stats = getMovieStats();

  return (
    <Page>
      <Back href="/">← Home</Back>
      <Title>Movies</Title>
      <Summary>
        {stats.watched} watched · {stats.watchlist} on the list · {stats.total}{" "}
        total
      </Summary>
      <List>
        {movies.map((movie) => (
          <Item key={movie.slug}>
            <ItemLink href={`/movies/${movie.slug}`}>
              <span>{movie.title}</span>
              <Meta>
                {movie.status}
                {movie.rating ? ` · ★ ${movie.rating}` : ""}
                {movie.watchedDates?.length
                  ? ` · ${movie.watchedDates.at(-1)}`
                  : ""}
              </Meta>
            </ItemLink>
          </Item>
        ))}
      </List>
    </Page>
  );
}
