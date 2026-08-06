import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1.75rem, 4vw, 2.75rem)",
  margin: 0,
  px: "$md",
  paddingTop: "clamp(1.5rem, 4vw, 2.5rem)",
  paddingBottom: "clamp(3rem, 8vw, 5rem)",
  overflowX: "clip",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

export const Heading = styled("h2", {
  margin: 0,
  fontFamily: "$section",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  fontWeight: 400,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "$sectionHeading",
});

/** Full-bleed carousel on mobile; contained from tablet up. */
export const CarouselFrame = styled("div", {
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
  marginRight: "calc(50% - 50vw)",

  "@md": {
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
  },
});

export const List = styled("ul", {
  display: "flex",
  gap: "$sm",
  width: "100%",
  margin: 0,
  paddingLeft: "$md",
  paddingRight: "$md",
  paddingBottom: "$sm",
  listStyle: "none",
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollPaddingLeft: "$md",
  scrollPaddingRight: "$md",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",

  "&::-webkit-scrollbar": {
    display: "none",
  },

  "@md": {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    justifyContent: "stretch",
    gap: "$md",
    overflow: "visible",
    padding: 0,
    scrollSnapType: "none",
  },
});

export const ListItem = styled("li", {
  flex: "0 0 10.5rem",
  scrollSnapAlign: "start",

  "@md": {
    flex: "unset",
    width: "100%",
  },
});

export const ShowAllLink = styled(Link, {
  fontFamily: "$section",
  fontSize: "$h4",
  color: "$sectionHeading",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  textDecorationThickness: "1px",

  "&:hover": {
    color: "$hiContrast",
  },
});
