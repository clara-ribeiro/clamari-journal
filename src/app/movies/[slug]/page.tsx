import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieBySlug, listMovies } from "@/application/use-cases/movies";
import { formatDate } from "@/lib/formatters/formatDate";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100vh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "48rem",
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
  marginBottom: "$md",
});

const Meta = styled("dl", {
  display: "grid",
  gridTemplateColumns: "8rem 1fr",
  gap: "$sm",
  color: "$textMuted",
  fontSize: "$sm",
  marginBottom: "$xl",
});

const Note = styled("p", {
  color: "$textMuted",
  fontSize: "$sm",
  padding: "$md",
  background: "$surface",
  borderRadius: "$md",
  border: "1px solid $border",
});

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);
  if (!movie) notFound();

  return (
    <Page>
      <Back href="/movies">← Movies</Back>
      <Title>{movie.title}</Title>
      <Meta>
        <dt>Status</dt>
        <dd>{movie.status}</dd>
        <dt>Rating</dt>
        <dd>{movie.rating ?? "—"}</dd>
        <dt>Watched</dt>
        <dd>
          {movie.watchedDates?.map((d) => formatDate(d)).join(" · ") || "—"}
        </dd>
        <dt>TMDB</dt>
        <dd>{movie.tmdbId ?? "pending enrichment"}</dd>
      </Meta>
      <Note>
        Dynamic template. Posters, synopsis, and cast will load from TMDB once
        `tmdbId` is resolved.
      </Note>
    </Page>
  );
}
