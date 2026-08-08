import { styled } from "@/styles/stitches.config";
import Link from "next/link";

/** Home carousel chrome on navy feed pages. */
export const Root = styled("article", {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
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
  display: "grid",
  width: "100%",
  aspectRatio: "2 / 3",
  overflow: "hidden",
  backgroundColor: "$surfaceAlt",

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
  },

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

export const BadgeSlot = styled("div", {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: "$sm",
  pointerEvents: "none",
});

export const StatusBadge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  px: "$sm",
  py: "0.15rem",
  fontSize: "$caption",
  fontWeight: 600,
  lineHeight: 1.2,
  color: "#FFFFFF",

  variants: {
    tone: {
      positive: {
        backgroundColor: "#357A60",
      },
      warning: {
        backgroundColor: "#A8642E",
      },
      neutral: {
        backgroundColor: "#6B7280",
      },
    },
  },
});

export const Meta = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  px: "$xs",
  pb: "$xs",
  minWidth: 0,

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

export const TitleRow = styled("div", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "$sm",
  minWidth: 0,
});

export const Title = styled("h3", {
  margin: 0,
  minWidth: 0,
  fontFamily: "$heading",
  fontSize: "$body2",
  fontWeight: 400,
  lineHeight: 1.25,
  color: "$cardText",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const Year = styled("span", {
  flexShrink: 0,
  fontSize: "$caption",
  fontVariantNumeric: "tabular-nums",
  color: "rgba(26, 26, 26, 0.62)",
});

export const Activity = styled("p", {
  margin: 0,
  fontSize: "$caption",
  color: "rgba(26, 26, 26, 0.62)",
});

export const PillRow = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$xs",
});

export const Pill = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3rem",
  px: "$sm",
  py: "0.2rem",
  border: "2px solid $buttonText",
  fontSize: "$caption",
  lineHeight: 1.2,
  color: "$buttonText",

  "& svg": {
    width: "0.85rem",
    height: "0.85rem",
    flexShrink: 0,
  },
});

export const TagRow = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$xs",
});

export const Tag = styled("span", {
  display: "inline-flex",
  px: "$sm",
  py: "0.2rem",
  fontSize: "$caption",
  lineHeight: 1.2,
  backgroundColor: "rgba(10, 30, 58, 0.08)",
  color: "rgba(26, 26, 26, 0.72)",
});

export const FavoriteMark = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  gap: "0.3rem",
  fontSize: "$caption",
  lineHeight: 1.2,
  color: "#C47878",

  "& svg": {
    width: "0.85rem",
    height: "0.85rem",
    flexShrink: 0,
  },
});
