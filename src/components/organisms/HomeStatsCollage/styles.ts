import Link from "next/link";
import { homeCopy } from "@/content/copy";
import { styled } from "@/styles/stitches.config";

const { pages, hours } = homeCopy.statsCollage.images;

/** ~0.3 photo opacity over $statsSurface (#C9A05A). */
function dimmedPhoto(src: string) {
  return `linear-gradient(rgba(201, 160, 90, 0.7), rgba(201, 160, 90, 0.7)), url(${src})`;
}

export const Section = styled("section", {
  margin: 0,
  paddingTop: "clamp(1.5rem, 4vw, 2.5rem)",
  paddingBottom: "clamp(3rem, 8vw, 5rem)",
  px: "$md",
  backgroundColor: "$statsSurface",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  backgroundBlendMode: "multiply",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

export const VisuallyHidden = styled("h2", {
  width: "1px",
  height: "1px",
  padding: 0,
  margin: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
});

export const Stack = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",

  "@md": {
    gap: "$md",
  },
});

export const Row = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",

  "@md": {
    flexDirection: "row",
    alignItems: "stretch",
    gap: "$md",
  },
});

export const PortraitCell = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",

  "@md": {
    flex: "3 1 0",
  },

  "& img": {
    width: "100%",
  },
});

export const LandscapeCell = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",

  "@md": {
    flex: "3 1 0",
  },

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export const StatCell = styled(Link, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  backgroundColor: "$statsSurface",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  transition: "transform $normal, box-shadow $normal",

  "@md": {
    flex: "2 1 0",
  },

  variants: {
    photo: {
      pages: {
        backgroundImage: dimmedPhoto(pages.src),
      },
      hours: {
        backgroundImage: dimmedPhoto(hours.src),
      },
    },
  },

  "& > svg": {
    transition: "transform $normal ease",
  },

  "&:hover": {
    transform: "translateY(-0.2rem)",
    boxShadow: "0 0.75rem 1.75rem rgba(43, 28, 18, 0.28)",

    "& > svg": {
      transform: "scale(1.02)",
    },
  },

  "&:active": {
    transform: "translateY(-0.05rem)",
    boxShadow: "0 0.35rem 1rem rgba(43, 28, 18, 0.22)",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.1875rem",
  },

  "@motionReduce": {
    transition: "none",

    "& > svg": {
      transition: "none",
    },

    "&:hover": {
      transform: "none",
      boxShadow: "none",

      "& > svg": {
        transform: "none",
      },
    },
  },
});

/** Stretches label to the full cell width via SVG textLength. */
export const StatFit = styled("svg", {
  display: "block",
  width: "100%",
  px: "$sm",
  color: "$statsText",

  "& text": {
    fill: "currentColor",
    fontFamily: "$section",
    fontWeight: 400,
    fontSize: 110,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
});
