import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesBySlug, listSeries } from "@/application/use-cases/series";
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
  gridTemplateColumns: "10rem 1fr",
  gap: "$sm",
  color: "$textMuted",
  fontSize: "$sm",
  marginBottom: "$xl",
});

const EpisodeList = styled("ul", {
  listStyle: "none",
  margin: 0,
  display: "grid",
  gap: "$xs",
  maxHeight: "24rem",
  overflow: "auto",
  border: "1px solid $border",
  borderRadius: "$md",
  padding: "$md",
  background: "$surface",
});

const Episode = styled("li", {
  fontSize: "$sm",
  color: "$textMuted",
  display: "flex",
  justifyContent: "space-between",
  gap: "$md",
});

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSeries().map((entry) => ({ slug: entry.slug }));
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getSeriesBySlug(slug);
  if (!entry) notFound();

  const preview = entry.watchedEpisodes.slice(0, 40);

  return (
    <Page>
      <Back href="/series">← Series</Back>
      <Title>{entry.title}</Title>
      <Meta>
        <dt>Status</dt>
        <dd>{entry.status}</dd>
        <dt>Favorite</dt>
        <dd>{entry.favorite ? "yes" : "no"}</dd>
        <dt>Started</dt>
        <dd>{formatDate(entry.startedAt)}</dd>
        <dt>Finished</dt>
        <dd>{formatDate(entry.finishedAt)}</dd>
        <dt>Episodes</dt>
        <dd>{entry.watchedEpisodes.length}</dd>
        <dt>TVDB</dt>
        <dd>{entry.tvdbId}</dd>
        <dt>TMDB</dt>
        <dd>{entry.tmdbId ?? "pending enrichment"}</dd>
      </Meta>

      {preview.length > 0 && (
        <>
          <h2 style={{ marginBottom: "0.75rem", fontSize: "1.25rem" }}>
            Watched episodes
            {entry.watchedEpisodes.length > preview.length
              ? ` (showing ${preview.length} of ${entry.watchedEpisodes.length})`
              : ""}
          </h2>
          <EpisodeList>
            {preview.map((ep) => (
              <Episode key={`${ep.season}-${ep.episode}`}>
                <span>
                  S{ep.season} E{ep.episode}
                </span>
                <span>{formatDate(ep.watchedAt)}</span>
              </Episode>
            ))}
          </EpisodeList>
        </>
      )}
    </Page>
  );
}
