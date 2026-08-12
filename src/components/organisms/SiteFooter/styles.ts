import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("footer", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1.75rem, 4vw, 2.5rem)",
  margin: 0,
  px: "$md",
  py: "clamp(2.5rem, 6vw, 3.5rem)",

  variants: {
    tone: {
      navy: {
        backgroundColor: "$bg",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "#FFFFFF",
      },
      stats: {
        backgroundColor: "$statsHeroBg",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "#FFFFFF",
      },
      films: {
        backgroundColor: "$catalogBgFilms",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "$catalogTextOnDark",
      },
      paper: {
        backgroundColor: "$catalogBgPaper",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "$catalogText",
      },
      white: {
        backgroundColor: "$statsLightBg",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "$catalogText",
      },
      /** Matches HomeJournalAbout’s closing field. */
      ink: {
        backgroundColor: "#0a0606",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "#FFFFFF",
      },
      clear: {
        backgroundColor: "transparent",
        backgroundImage: "none",
        color: "$catalogTextOnDark",
        py: "$lg",
      },
    },
  },

  defaultVariants: {
    tone: "navy",
  },

  "@md": {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "$lg",
    px: "$xl",
    py: "clamp(2rem, 4vw, 2.75rem)",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

const brandStyles = {
  margin: 0,
  flex: "1 1 0",
  fontFamily: "$display",
  fontWeight: 400,
  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
  lineHeight: 1,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "inherit",
  textDecoration: "none",

  "@md": {
    textAlign: "left",
    fontSize: "clamp(2.25rem, 4vw, 3rem)",
  },
} as const;

export const Brand = styled("p", brandStyles);

export const BrandLink = styled(Link, {
  ...brandStyles,
  transition: "opacity $fast ease",

  "&:hover": {
    opacity: 0.85,
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.25rem",
  },

  "@motionReduce": {
    transition: "none",
  },
});

export const Meta = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.35rem",
  flex: "1 1 0",
  fontFamily: "$body",
  fontWeight: 400,
  fontSize: "0.6875rem",
  lineHeight: 1.45,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "inherit",

  "@md": {
    fontSize: "0.625rem",
  },

  "@lg": {
    fontSize: "0.75rem",
  },
});

export const Credit = styled("p", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: 0,

  "@md": {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: "0.35em",
  },
});

export const Line = styled("p", {
  margin: 0,
});

export const SocialNav = styled("nav", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$md",
  flex: "1 1 0",

  "@md": {
    justifyContent: "flex-end",
  },
});

export const SocialLink = styled("a", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "$controlMin",
  minHeight: "$controlMin",
  color: "inherit",
  transition: "opacity $fast ease",

  "&:hover": {
    opacity: 0.75,
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.25rem",
  },

  "@motionReduce": {
    transition: "none",
  },
});

export const SocialIcon = styled("svg", {
  display: "block",
  width: "1.5rem",
  height: "1.5rem",
});
