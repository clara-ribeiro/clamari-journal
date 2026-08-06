import { styled } from "@/styles/stitches.config";
import Link from "next/link";

export const Page = styled("main", {
  minHeight: "100dvh",
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerContent",
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
  marginBottom: "$sm",
});

export const Summary = styled("p", {
  color: "$loContrast",
  marginBottom: "$xl",
});

export const List = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "$sm",
});

export const Item = styled("li", {
  borderBottom: "1px solid $border",
  py: "$sm",
});

export const ItemLink = styled(Link, {
  display: "flex",
  justifyContent: "space-between",
  gap: "$md",
  flexWrap: "wrap",
  "&:hover": { color: "$primary" },
});

export const Meta = styled("span", {
  color: "$loContrast",
  fontSize: "$body2",
});

export const Empty = styled("p", {
  color: "$loContrast",
  padding: "$xl",
  border: "1px dashed $border",
  borderRadius: "$lg",
  textAlign: "center",
});
