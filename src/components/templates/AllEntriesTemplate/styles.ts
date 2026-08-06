import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Page = styled("main", {
  minHeight: "100dvh",
  px: "$md",
  py: "$2xl",
  maxWidth: "$containerWide",
  mx: "auto",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "@md": {
    px: "$xl",
  },
});

export const Back = styled(Link, {
  color: "$loContrast",
  fontSize: "$body2",
  display: "inline-block",
  marginBottom: "$lg",

  "&:hover": { color: "$primary" },
});

export const Title = styled("h1", {
  fontFamily: "$heading",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: "$sm",
});

export const Description = styled("p", {
  color: "$loContrast",
  marginBottom: "$xl",
  maxWidth: "40rem",
});

export const List = styled("ul", {
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
});

export const ListItem = styled("li", {
  minWidth: 0,
});

export const Empty = styled("p", {
  color: "$loContrast",
});
