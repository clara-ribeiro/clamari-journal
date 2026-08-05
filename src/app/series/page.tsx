import Link from "next/link";
import { listSeries, getSeriesStats } from "@/application/use-cases/series";
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

export default function SeriesPage() {
  const series = listSeries();
  const stats = getSeriesStats();

  return (
    <Page>
      <Back href="/">← Home</Back>
      <Title>Series</Title>
      <Summary>
        {stats.total} series · {stats.watchedEpisodes} episodes ·{" "}
        {stats.completed} completed · {stats.watching} watching
      </Summary>
      <List>
        {series.map((entry) => (
          <Item key={entry.slug}>
            <ItemLink href={`/series/${entry.slug}`}>
              <span>{entry.title}</span>
              <Meta>
                {entry.status}
                {entry.favorite ? " · ♥" : ""}
                {entry.watchedEpisodes.length
                  ? ` · ${entry.watchedEpisodes.length} eps`
                  : ""}
              </Meta>
            </ItemLink>
          </Item>
        ))}
      </List>
    </Page>
  );
}
