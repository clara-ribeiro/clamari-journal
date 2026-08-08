import { styled } from "@/styles/stitches.config";

export const Page = styled("main", {
  minHeight: "100dvh",
  px: "$md",
  py: "$2xl",
  maxWidth: "$containerWide",
  mx: "auto",
  width: "100%",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  scrollMarginBlockStart: "$headerHeight",
  color: "$hiContrast",

  "& *, & *::before, & *::after": {
    borderRadius: "0 !important",
  },

  "@md": {
    px: "$xl",
  },
});

export const Title = styled("h1", {
  margin: 0,
  marginBottom: "$sm",
  fontFamily: "$section",
  fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
  fontWeight: 400,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "$sectionHeading",
});

export const Description = styled("p", {
  margin: 0,
  marginBottom: "$xl",
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "42rem",
  fontFamily: "$section",
  fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
  fontWeight: 400,
  lineHeight: 1.45,
  textAlign: "center",
  color: "$sectionHeading",
});

export const Grid = styled("ul", {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "$md",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

  "@md": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "$lg",
  },

  "@lg": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },

  "@xl": {
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  },
});

export const ListGrid = styled("ul", {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: 0,
  gridTemplateColumns: "minmax(0, 1fr)",
  borderTop: "2px solid $catalogBorderOnDark",
  borderLeft: "2px solid $catalogBorderOnDark",
});

export const Cell = styled("li", {
  minWidth: 0,

  variants: {
    layout: {
      cards: {},
      list: {
        borderRight: "2px solid $catalogBorderOnDark",
        borderBottom: "2px solid $catalogBorderOnDark",
      },
    },
  },

  defaultVariants: {
    layout: "cards",
  },
});

export const Empty = styled("p", {
  padding: "$xl",
  textAlign: "center",
  color: "$loContrast",
  border: "1px dashed $catalogBorderOnDark",
});

export const Summary = styled("p", {
  margin: 0,
  marginTop: "$xl",
  color: "$loContrast",
});

export const LoadMore = styled("button", {
  display: "block",
  width: "100%",
  marginTop: "$xl",
  padding: "$md $lg",
  border: "2px solid $catalogBorderOnDark",
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
});
