import { styled } from "@/styles/stitches.config";
import Link from "next/link";

export const Page = styled("div", {
  minHeight: "100dvh",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  variants: {
    medium: {
      films: {
        backgroundColor: "$catalogBgFilms",
        color: "$catalogTextOnDark",
      },
      books: {
        backgroundColor: "$catalogBgPaper",
        color: "$catalogText",
      },
      series: {
        backgroundColor: "$catalogBgPaper",
        color: "$catalogText",
      },
    },
  },
});

/** Visually hidden page title (Films / Series / Books). */
export const Title = styled("h1", {
  display: "inline-block",
  width: "1px",
  height: "1px",
  margin: 0,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});

export const Content = styled("main", {
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerContent",
  mx: "auto",
});

export const Back = styled(Link, {
  fontSize: "$body2",
  display: "inline-block",
  marginBottom: "$lg",
  opacity: 0.62,
  "&:hover": { opacity: 1 },

  variants: {
    medium: {
      films: { color: "$catalogTextOnDark" },
      books: { color: "$catalogText" },
      series: { color: "$catalogText" },
    },
  },
});

export const Summary = styled("p", {
  marginBottom: "$xl",
  opacity: 0.62,
});

export const List = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "$sm",
});

export const Item = styled("li", {
  py: "$sm",
  minWidth: 0,

  variants: {
    medium: {
      films: { borderBottom: "1px solid $catalogBorderOnDark" },
      books: { borderBottom: "1px solid $catalogBorder" },
      series: { borderBottom: "1px solid $catalogBorder" },
    },
  },
});

export const ItemLink = styled(Link, {
  display: "flex",
  justifyContent: "space-between",
  gap: "$md",
  flexWrap: "wrap",
  color: "inherit",
  minWidth: 0,
  "&:hover": { opacity: 0.72 },
});

export const Meta = styled("span", {
  fontSize: "$body2",
  opacity: 0.62,
});

export const Empty = styled("p", {
  padding: "$xl",
  borderRadius: "$lg",
  textAlign: "center",
  opacity: 0.62,

  variants: {
    medium: {
      films: { border: "1px dashed $catalogBorderOnDark" },
      books: { border: "1px dashed $catalogBorder" },
      series: { border: "1px dashed $catalogBorder" },
    },
  },
});
