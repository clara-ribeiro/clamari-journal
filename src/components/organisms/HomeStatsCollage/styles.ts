import Link from "next/link";
import { homeCopy } from "@/content/copy";
import { styled } from "@/styles/stitches.config";

const { pages, hours } = homeCopy.statsCollage.images;

/** ~0.3 photo opacity over $statsSurface (#C9A05A). */
function dimmedPhoto(src: string) {
  return `linear-gradient(rgba(201, 160, 90, 0.7), rgba(201, 160, 90, 0.7)), url(${src})`;
}

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
  width: "100%",
  maxWidth: "$containerWide",
  mx: "auto",

  "@md": {
    gap: "$md",
  },
});

export const Row = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  width: "100%",

  "@md": {
    flexDirection: "row",
    alignItems: "stretch",
    gap: "$md",
  },
});

const cellBase = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: 0,
  minWidth: 0,
  color: "inherit",
  textDecoration: "none",
  backgroundColor: "$statsSurface",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
} as const;

export const PortraitCell = styled("div", {
  ...cellBase,
  backgroundColor: "transparent",
  minHeight: "18rem",
  width: "100%",

  "@md": {
    flex: "3 1 0",
    minHeight: "24rem",
  },

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center bottom",
  },
});

export const LandscapeCell = styled("div", {
  ...cellBase,
  minHeight: "14rem",
  width: "100%",

  "@md": {
    flex: "3 1 0",
    minHeight: "18rem",
  },

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
});

export const StatCell = styled(Link, {
  ...cellBase,
  minHeight: "12rem",
  width: "100%",
  cursor: "pointer",
  transition: "transform $normal, box-shadow $normal",
  willChange: "transform",

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
    tall: {
      true: {
        "@md": {
          minHeight: "24rem",
        },
      },
      false: {
        "@md": {
          minHeight: "18rem",
        },
      },
    },
  },

  defaultVariants: {
    tall: false,
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
    willChange: "auto",

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
