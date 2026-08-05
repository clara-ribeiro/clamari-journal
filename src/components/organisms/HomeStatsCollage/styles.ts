import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  width: "100%",
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
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

export const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateAreas: `
    "portrait"
    "pages"
    "hours"
    "landscape"
  `,
  gap: "$sm",
  width: "100%",
  maxWidth: "$containerWide",
  mx: "auto",

  // Asymmetric collage: wide → narrow / narrow → wide
  "@md": {
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gridTemplateAreas: `
      "portrait portrait portrait pages pages"
      "hours hours landscape landscape landscape"
    `,
    gap: "$md",
  },
});

const cellBase = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: 0,
  backgroundColor: "$statsSurface",
  minHeight: "14rem",
  color: "inherit",
  textDecoration: "none",
} as const;

const areaVariants = {
  portrait: {
    gridArea: "portrait",
    backgroundColor: "transparent",
    minHeight: "18rem",
    overflow: "visible",

    "@md": {
      minHeight: "24rem",
    },

    "& img": {
      objectFit: "contain",
      objectPosition: "center bottom",
    },
  },
  pages: {
    gridArea: "pages",
    minHeight: "12rem",

    "@md": {
      minHeight: "24rem",
    },

    "& img": {
      opacity: 0.4,
    },
  },
  hours: {
    gridArea: "hours",
    minHeight: "12rem",

    "@md": {
      minHeight: "18rem",
    },
  },
  landscape: {
    gridArea: "landscape",
    minHeight: "14rem",

    "@md": {
      minHeight: "18rem",
    },
  },
} as const;

export const Cell = styled("div", {
  ...cellBase,
  variants: {
    area: areaVariants,
  },
});

export const CellLink = styled(Link, {
  ...cellBase,
  cursor: "pointer",
  transition: "transform $normal, box-shadow $normal",
  willChange: "transform",

  "& img": {
    transition: "transform $slow ease, filter $normal ease",
  },

  "& > svg": {
    transition: "transform $normal ease",
  },

  "&:hover": {
    transform: "translateY(-0.2rem)",
    boxShadow: "0 0.75rem 1.75rem rgba(43, 28, 18, 0.28)",

    "& img": {
      transform: "scale(1.06)",
      filter: "brightness(1.06)",
    },

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
    willChange: "auto",

    "& img, & > svg": {
      transition: "none",
    },

    "&:hover": {
      transform: "none",
      boxShadow: "none",

      "& img": {
        transform: "none",
        filter: "none",
      },

      "& > svg": {
        transform: "none",
      },
    },
  },

  variants: {
    area: areaVariants,
  },
});

export const Media = styled("div", {
  position: "absolute",
  inset: 0,

  "& img": {
    objectFit: "cover",
    objectPosition: "center",
  },
});

export const Overlay = styled("div", {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(201, 160, 90, 0.35)",
  mixBlendMode: "multiply",
  pointerEvents: "none",
});

/** Stretches label to the full cell width via SVG textLength. */
export const StatFit = styled("svg", {
  position: "relative",
  zIndex: 1,
  display: "block",
  width: "100%",
  maxWidth: "100%",
  height: "auto",
  overflow: "visible",
  px: "$sm",
  color: "$statsText",
  transition: "transform $normal ease",

  "& text": {
    fill: "currentColor",
    fontFamily: 'var(--font-instrument-serif), Georgia, "Times New Roman", serif',
    fontWeight: 400,
    fontSize: 110,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
});
