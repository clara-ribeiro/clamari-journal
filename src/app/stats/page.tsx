import Link from "next/link";
import { getHomeSummary, getGoalProgress } from "@/application/use-cases/stats";
import { formatDuration } from "@/lib/formatters/formatDate";
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
  marginBottom: "$xl",
});

const Grid = styled("section", {
  display: "grid",
  gap: "$md",
  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
  marginBottom: "$2xl",
});

const Card = styled("div", {
  background: "$surface",
  border: "1px solid $border",
  borderRadius: "$lg",
  padding: "$lg",
});

const Value = styled("p", {
  fontFamily: "$heading",
  fontSize: "$h2",
  color: "$primary",
});

const Label = styled("p", {
  color: "$loContrast",
  fontSize: "$body2",
  marginTop: "$xs",
});

const SectionTitle = styled("h2", {
  fontSize: "$h3",
  marginBottom: "$md",
});

export default function StatsPage() {
  const summary = getHomeSummary();
  const goals = getGoalProgress();

  return (
    <Page>
      <Back href="/">← Home</Back>
      <Title>Stats</Title>

      <Grid>
        <Card>
          <Value>{summary.totals.works}</Value>
          <Label>Works logged</Label>
        </Card>
        <Card>
          <Value>{summary.movies.watched}</Value>
          <Label>Movies watched</Label>
        </Card>
        <Card>
          <Value>{summary.series.completed}</Value>
          <Label>Series completed</Label>
        </Card>
        <Card>
          <Value>{summary.series.watchedEpisodes}</Value>
          <Label>Episodes watched</Label>
        </Card>
        <Card>
          <Value>{summary.books.finished}</Value>
          <Label>Books finished</Label>
        </Card>
        <Card>
          <Value>{summary.books.pagesRead}</Value>
          <Label>Pages read</Label>
        </Card>
        <Card>
          <Value>{formatDuration(summary.movies.totalRuntimeMinutes)}</Value>
          <Label>Movie watch time</Label>
        </Card>
        <Card>
          <Value>{formatDuration(summary.series.totalRuntimeMinutes)}</Value>
          <Label>Series watch time</Label>
        </Card>
        <Card>
          <Value>
            {formatDuration(
              summary.movies.totalRuntimeMinutes +
                summary.series.totalRuntimeMinutes,
            )}
          </Value>
          <Label>TV watch time</Label>
        </Card>
      </Grid>

      <SectionTitle>Goals</SectionTitle>
      <Grid>
        {goals.map((goal) => (
          <Card key={goal.key}>
            <Value>
              {goal.current}/{goal.target}
            </Value>
            <Label>
              {goal.label} · {goal.percent}% · {goal.remaining} remaining
            </Label>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}
