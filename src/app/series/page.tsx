import Link from "next/link";
import { listSeries, getSeriesStats } from "@/application/use-cases/series";
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
