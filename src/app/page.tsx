import Link from "next/link";
import { getHomeSummary } from "@/application/use-cases/stats";
import { styled } from "@/styles/stitches.config";

const Page = styled("main", {
  minHeight: "100vh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "72rem",
  mx: "auto",
});

const Brand = styled("p", {
  fontFamily: "$heading",
  fontSize: "$xl",
  color: "$accent",
  marginBottom: "$sm",
});

const Title = styled("h1", {
  fontSize: "$3xl",
  marginBottom: "$md",
});

const Lead = styled("p", {
  color: "$textMuted",
  fontSize: "$lg",
  maxWidth: "36rem",
  marginBottom: "$2xl",
});

const Nav = styled("nav", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$md",
  marginBottom: "$2xl",
});

const NavLink = styled(Link, {
  px: "$md",
  py: "$sm",
  border: "1px solid $border",
  borderRadius: "$md",
  color: "$text",
  transition: "background 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    background: "$accentSoft",
    borderColor: "$accent",
  },
});

const Stats = styled("section", {
  display: "grid",
  gap: "$md",
  gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
});

const StatCard = styled("div", {
  background: "$surface",
  border: "1px solid $border",
  borderRadius: "$lg",
  padding: "$lg",
});

const StatValue = styled("p", {
  fontFamily: "$heading",
  fontSize: "$2xl",
  color: "$accent",
});

const StatLabel = styled("p", {
  color: "$textMuted",
  fontSize: "$sm",
  marginTop: "$xs",
});

const Note = styled("p", {
  marginTop: "$2xl",
  color: "$textMuted",
  fontSize: "$sm",
});

export default function HomePage() {
  const summary = getHomeSummary();

  return (
    <Page>
      <Brand>clamari journal</Brand>
      <Title>A diary of movies, series, and books</Title>
      <Lead>
        A personal diary to track stories I&apos;ve watched, followed, and read
        over time.
      </Lead>

      <Nav aria-label="Main">
        <NavLink href="/movies">Movies</NavLink>
        <NavLink href="/series">Series</NavLink>
        <NavLink href="/books">Books</NavLink>
        <NavLink href="/stats">Stats</NavLink>
      </Nav>

      <Stats>
        <StatCard>
          <StatValue>{summary.totals.watchedMovies}</StatValue>
          <StatLabel>Movies watched</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{summary.series.withProgress}</StatValue>
          <StatLabel>Series followed</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{summary.totals.watchedEpisodes}</StatValue>
          <StatLabel>Episodes watched</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{summary.totals.finishedBooks}</StatValue>
          <StatLabel>Books read</StatLabel>
        </StatCard>
      </Stats>

      <Note>
        Initial scaffold with data imported from TV Time. Visual identity and
        full pages come next.
      </Note>
    </Page>
  );
}
