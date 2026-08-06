import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("article", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "$buttonSurface",
  border: "none",
  outline: "2px solid $buttonText",
  outlineOffset: "-0.625rem",
  overflow: "hidden",
  transition: "transform $normal, box-shadow $normal",
  boxShadow: "0 0 0 0 rgba(245, 210, 58, 0)",

  "& img": {
    transition: "transform $slow ease, filter $normal ease",
  },

  "&:hover": {
    transform: "translateY(-0.2rem)",
    boxShadow: "0 0 1.25rem 0.1rem rgba(245, 210, 58, 0.35)",

    "& img": {
      transform: "scale(1.06)",
      filter: "brightness(1.06)",
    },
  },

  "&:active": {
    transform: "translateY(-0.05rem)",
    boxShadow: "0 0 0.75rem 0.05rem rgba(245, 210, 58, 0.25)",
  },

  "@motionReduce": {
    transition: "none",

    "& img": {
      transition: "none",
    },

    "&:hover": {
      transform: "none",
      boxShadow: "none",

      "& img": {
        transform: "none",
        filter: "none",
      },
    },
  },
});

export const CardLink = styled(Link, {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  height: "100%",
  padding: "0.95rem",
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
  aspectRatio: "2 / 3",
  overflow: "hidden",
  backgroundColor: "$surfaceAlt",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export const PosterPlaceholder = styled("div", {
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(145deg, $colors$surfaceAlt 0%, $colors$surface 100%)",
});

export const Meta = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  px: "$xs",
  pb: "$xs",

  "& [role='img'] svg[data-state='empty']": {
    fill: "$buttonText",
    stroke: "$buttonText",
  },
  "& [role='img'] [data-half='empty']": {
    color: "$buttonText",
  },
  "& [role='img'] [data-half='empty'] svg": {
    fill: "$buttonText",
    stroke: "$buttonText",
  },
});

export const Title = styled("h3", {
  margin: 0,
  fontFamily: "$heading",
  fontSize: "$body2",
  fontWeight: 400,
  lineHeight: 1.25,
  color: "$cardText",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
