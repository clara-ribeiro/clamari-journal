import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Bar = styled("header", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: "$sticky",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$md",
  height: "$headerHeight",
  px: "$md",
  transition: "transform $normal ease",

  variants: {
    visible: {
      true: {
        transform: "translateY(0)",
      },
      false: {
        transform: "translateY(-100%)",
      },
    },
    tone: {
      navy: {
        backgroundColor: "rgba(2, 21, 112, 0.8)",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "#FFFFFF",
      },
      stats: {
        backgroundColor: "rgba(19, 19, 19, 0.8)",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "#FFFFFF",
      },
      films: {
        backgroundColor: "rgba(42, 34, 28, 0.8)",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "$catalogTextOnDark",
      },
      paper: {
        backgroundColor: "rgba(248, 240, 222, 0.8)",
        backgroundImage: "url(/images/shared/noise-grain.webp)",
        backgroundSize: "128px 128px",
        backgroundRepeat: "repeat",
        color: "$catalogText",
      },
      clear: {
        backgroundColor: "transparent",
        backgroundImage: "none",
        color: "$catalogTextOnDark",
      },
    },
  },

  defaultVariants: {
    visible: false,
    tone: "navy",
  },

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },

  "@motionReduce": {
    transition: "none",
  },
});

export const Spacer = styled("div", {
  height: "$headerHeight",
  flexShrink: 0,
});

export const Nav = styled("nav", {
  display: "flex",
  alignItems: "center",
  gap: "clamp(1rem, 3vw, 2rem)",
  minWidth: 0,
});

export const NavLink = styled(Link, {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "$controlMin",
  fontFamily: "$section",
  fontWeight: 400,
  fontSize: "clamp(1rem, 2vw, 1.25rem)",
  lineHeight: 1.2,
  letterSpacing: "0.01em",
  textDecoration: "none",
  textUnderlineOffset: "0.2em",
  textDecorationThickness: "1px",
  whiteSpace: "nowrap",
  transition: "opacity $fast ease",

  "&:hover": {
    textDecoration: "underline",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.25rem",
  },

  variants: {
    active: {
      true: {
        textDecoration: "underline",
      },
    },
    tone: {
      navy: {
        color: "$sectionHeading",
      },
      stats: {
        color: "$sectionHeading",
      },
      films: {
        color: "$catalogTextOnDark",
      },
      paper: {
        color: "$catalogText",
      },
      clear: {
        color: "$catalogTextOnDark",
      },
    },
  },

  defaultVariants: {
    tone: "navy",
  },

  "@motionReduce": {
    transition: "none",
  },
});

const brandStyles = {
  margin: 0,
  fontFamily: "$display",
  fontWeight: 400,
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  lineHeight: 1,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  color: "inherit",
  textDecoration: "none",
  flexShrink: 0,
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
