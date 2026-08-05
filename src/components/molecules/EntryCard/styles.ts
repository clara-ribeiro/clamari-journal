import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("article", {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  height: "100%",
  backgroundColor: "$card",
  borderRadius: "$lg",
  overflow: "hidden",
});

export const CardLink = styled(Link, {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  height: "100%",
  padding: "$sm",
  color: "$cardText",
  textDecoration: "none",

  "&:hover h3": {
    textDecoration: "underline",
    textUnderlineOffset: "0.15em",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

export const PosterFrame = styled("div", {
  position: "relative",
  width: "100%",
  aspectRatio: "3 / 4",
  overflow: "hidden",
  borderRadius: "$md",
  backgroundColor: "$surfaceAlt",

  "& img": {
    objectFit: "cover",
  },
});

export const PosterPlaceholder = styled("div", {
  size: "100%",
  background:
    "linear-gradient(145deg, $colors$surfaceAlt 0%, $colors$surface 100%)",
});

export const Meta = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  px: "$xs",
  pb: "$xs",
  minWidth: 0,
});

export const Title = styled("h3", {
  margin: 0,
  fontFamily: "$heading",
  fontSize: "$body1",
  fontWeight: 400,
  lineHeight: 1.25,
  color: "$cardText",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
