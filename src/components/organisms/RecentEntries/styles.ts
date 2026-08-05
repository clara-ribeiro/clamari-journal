import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1.75rem, 4vw, 2.75rem)",
  width: "100%",
  margin: 0,
  px: "$md",
  py: "clamp(3rem, 8vw, 5rem)",
  overflow: "hidden",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "@md": {
    px: "$xl",
  },
});

export const Heading = styled("h2", {
  margin: 0,
  fontFamily: "$heading",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  fontWeight: 400,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "$hiContrast",
});

export const List = styled("ul", {
  display: "flex",
  gap: "$md",
  width: "100%",
  maxWidth: "$containerWide",
  margin: 0,
  padding: "0 $md $sm",
  listStyle: "none",
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollPaddingInline: "$md",
  WebkitOverflowScrolling: "touch",

  "&::-webkit-scrollbar": {
    height: "0.375rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "$border",
    borderRadius: "$full",
  },

  "@lg": {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "$lg",
    overflow: "visible",
    padding: 0,
    scrollSnapType: "none",
  },
});

export const ListItem = styled("li", {
  flex: "0 0 min(72vw, 16rem)",
  scrollSnapAlign: "start",
  minWidth: 0,

  "@md": {
    flexBasis: "min(42vw, 18rem)",
  },

  "@lg": {
    flex: "unset",
  },
});

export const ShowAllLink = styled(Link, {
  fontFamily: "$heading",
  fontSize: "$h4",
  color: "$hiContrast",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  textDecorationThickness: "1px",

  "&:hover": {
    color: "$primary",
  },
});
