import Link from "next/link";
import { listMovies, getMovieStats } from "@/application/use-cases/movies";
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
  "&:hover": { color: "$accent" },
});

const Meta = styled("span", {
  color: "$textMuted",
  fontSize: "$sm",
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
