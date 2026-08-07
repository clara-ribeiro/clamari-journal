import { styled } from "@/styles/stitches.config";
import Link from "next/link";

export const Page = styled("div", {
  minHeight: "100dvh",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "& *, & *::before, & *::after": {
    borderRadius: "0 !important",
  },

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
  px: "$md",
  py: "$xl",
  maxWidth: "$containerWide",
  mx: "auto",
  width: "100%",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
    py: "$2xl",
  },
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
  marginBottom: "$lg",
  color: "inherit",
  opacity: 0.85,
});

export const Grid = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: 0,
  gridTemplateColumns: "minmax(0, 1fr)",

  "@md": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@lg": {
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  },

  variants: {
    tone: {
      light: {
        borderTop: "2px solid $catalogBorder",
        borderLeft: "2px solid $catalogBorder",
      },
      dark: {
        borderTop: "2px solid $catalogBorderOnDark",
        borderLeft: "2px solid $catalogBorderOnDark",
      },
    },
  },
});

/** Single-column list — base columns so CSS always applies. */
export const ListGrid = styled("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: 0,
  gridTemplateColumns: "minmax(0, 1fr)",

  variants: {
    tone: {
      light: {
        borderTop: "2px solid $catalogBorder",
        borderLeft: "2px solid $catalogBorder",
      },
      dark: {
        borderTop: "2px solid $catalogBorderOnDark",
        borderLeft: "2px solid $catalogBorderOnDark",
      },
    },
  },
});

export const Cell = styled("li", {
  minWidth: 0,

  variants: {
    tone: {
      light: {
        borderRight: "2px solid $catalogBorder",
        borderBottom: "2px solid $catalogBorder",
      },
      dark: {
        borderRight: "2px solid $catalogBorderOnDark",
        borderBottom: "2px solid $catalogBorderOnDark",
      },
    },
  },
});

export const Empty = styled("p", {
  padding: "$xl",
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

export const LoadMore = styled("button", {
  display: "block",
  width: "100%",
  marginTop: "$xl",
  padding: "$md $lg",
  border: "2px solid",
  background: "transparent",
  color: "inherit",
  fontSize: "$body2",
  cursor: "pointer",
  textAlign: "center",

  "&:hover": {
    opacity: 0.85,
  },

  "&:focus-visible": {
    outline: "2px solid $focus",
    outlineOffset: 2,
  },

  variants: {
    tone: {
      light: {
        borderColor: "$catalogBorder",
      },
      dark: {
        borderColor: "$catalogBorderOnDark",
      },
    },
  },
});
