import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Page = styled("main", {
  minHeight: "100dvh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerReading",
  mx: "auto",
});

export const Back = styled(Link, {
  color: "$loContrast",
  fontSize: "$body2",
  display: "inline-block",
  marginBottom: "$lg",
  "&:hover": { color: "$primary" },
});

export const Title = styled("h1", {
  fontSize: "$h2",
  marginBottom: "$md",
});

export const Meta = styled("dl", {
  display: "grid",
  gridTemplateColumns: "10rem 1fr",
  gap: "$sm",
  color: "$loContrast",
  fontSize: "$body2",
  marginBottom: "$xl",
});

export const Note = styled("p", {
  color: "$loContrast",
  fontSize: "$body2",
  padding: "$md",
  background: "$surface",
  borderRadius: "$md",
  border: "1px solid $border",
});

export const EpisodesHeading = styled("h2", {
  fontSize: "$h4",
  marginBottom: "$md",
});

export const EpisodeList = styled("ul", {
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

export const Episode = styled("li", {
  fontSize: "$body2",
  color: "$loContrast",
  display: "flex",
  justifyContent: "space-between",
  gap: "$md",
});
