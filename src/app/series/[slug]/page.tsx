import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesBySlug, listSeries } from "@/application/use-cases/series";
import { formatDate } from "@/lib/formatters/formatDate";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100dvh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerReading",
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
  marginBottom: "$md",
});

const Meta = styled("dl", {
  display: "grid",
  gridTemplateColumns: "10rem 1fr",
  gap: "$sm",
  color: "$loContrast",
  fontSize: "$body2",
  marginBottom: "$xl",
});

const EpisodesHeading = styled("h2", {
  fontSize: "$h4",
  marginBottom: "$md",
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
  fontSize: "$body2",
  color: "$loContrast",
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
          <EpisodesHeading>
            Watched episodes
            {entry.watchedEpisodes.length > preview.length
              ? ` (showing ${preview.length} of ${entry.watchedEpisodes.length})`
              : ""}
          </EpisodesHeading>
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
