import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("article", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
  height: "100%",
  py: "$sm",
  px: "$sm",

  "@md": {
    py: "$md",
    px: "$md",
  },

  variants: {
    tone: {
      light: {
        color: "$catalogText",
      },
      dark: {
        color: "$catalogTextOnDark",
      },
    },
    layout: {
      cards: {},
      list: {
        gap: 0,
        py: "$sm",
        height: "auto",
      },
    },
  },
});

export const CardLink = styled(Link, {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
  color: "inherit",
  textDecoration: "none",

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

/** Single-row list entry — grid columns keep rows aligned across the list. */
export const ListLink = styled(Link, {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 3.5rem max-content 2.75rem",
  alignItems: "center",
  columnGap: "$md",
  width: "100%",
  minWidth: 0,
  color: "inherit",
  textDecoration: "none",

  "& h2": {
    minWidth: 0,
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

/** Stack poster + badge without absolute positioning. Poster art is 2:3. */
export const PosterFrame = styled("div", {
  display: "grid",
  width: "100%",
  aspectRatio: "2 / 3",
  overflow: "hidden",

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

  variants: {
    tone: {
      light: {
        backgroundColor: "rgba(26, 20, 16, 0.08)",
      },
      dark: {
        backgroundColor: "rgba(241, 223, 194, 0.08)",
      },
    },
  },
});

export const PosterPlaceholder = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "#CDBFA8",
  backgroundImage: "url(/images/shared/cover-placeholder.svg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
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
        // Darkened for WCAG AA (≥4.5:1) with white caption text.
        backgroundColor: "#357A60",
      },
      warning: {
        backgroundColor: "#A8642E",
      },
      neutral: {
        backgroundColor: "#6B7280",
      },
    },
    align: {
      default: {},
      list: {
        justifyContent: "center",
        minWidth: "5.5rem",
        textAlign: "center",
      },
    },
  },

  defaultVariants: {
    align: "default",
  },
});

export const TitleRow = styled("div", {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "$sm",
  minWidth: 0,
});

export const ListFlags = styled("span", {
  display: "grid",
  gridTemplateColumns: "1rem 1rem",
  alignItems: "center",
  justifyItems: "center",
  columnGap: "$xs",
  width: "2.75rem",
  flexShrink: 0,

  "& svg": {
    width: "1rem",
    height: "1rem",
  },
});

export const ListFlag = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1rem",
  height: "1rem",
  color: "inherit",

  variants: {
    emphasis: {
      true: {
        color: "#C47878",
      },
      false: {},
    },
  },
});

export const ListFlagSlot = styled("span", {
  display: "block",
  width: "1rem",
  height: "1rem",
});

export const Title = styled("h2", {
  margin: 0,
  minWidth: 0,
  fontFamily: "$body",
  fontSize: "$body1",
  fontWeight: 700,
  lineHeight: 1.25,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  variants: {
    tone: {
      light: {
        color: "$catalogText",
      },
      dark: {
        color: "$catalogTextOnDark",
      },
    },
  },
});

export const Year = styled("span", {
  flexShrink: 0,
  fontSize: "$body2",
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",

  variants: {
    tone: {
      light: {
        color: "$catalogMuted",
      },
      dark: {
        color: "$catalogMutedOnDark",
      },
    },
  },
});

export const ActivityRow = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$sm",
});

export const Activity = styled("p", {
  margin: 0,
  fontSize: "$caption",

  variants: {
    tone: {
      light: {
        color: "$catalogMuted",
      },
      dark: {
        color: "$catalogMutedOnDark",
      },
    },
  },
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
  border: "2px solid",
  fontSize: "$caption",
  lineHeight: 1.2,

  "& svg": {
    width: "0.85rem",
    height: "0.85rem",
    flexShrink: 0,
  },

  variants: {
    tone: {
      light: {
        borderColor: "$catalogBorder",
        color: "$catalogText",
      },
      dark: {
        borderColor: "$catalogBorderOnDark",
        color: "$catalogTextOnDark",
      },
    },
    active: {
      true: {},
      false: {
        opacity: 0.75,
      },
    },
    emphasis: {
      true: {
        color: "#C47878",
      },
      false: {},
    },
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

  variants: {
    tone: {
      light: {
        backgroundColor: "rgba(26, 20, 16, 0.08)",
        color: "$catalogMuted",
      },
      dark: {
        backgroundColor: "rgba(241, 223, 194, 0.12)",
        color: "$catalogMutedOnDark",
      },
    },
  },
});

export const RatingSlot = styled("div", {
  variants: {
    tone: {
      light: {
        "& [role='img'] svg[data-state='full']": {
          fill: "$catalogText",
          stroke: "$catalogText",
        },
        "& [role='img'] svg[data-state='empty']": {
          fill: "transparent",
          stroke: "$catalogText",
        },
        "& [role='img'] [data-half='fill'] svg": {
          fill: "$catalogText",
          stroke: "$catalogText",
        },
        "& [role='img'] [data-half='empty'] svg": {
          fill: "transparent",
          stroke: "$catalogText",
        },
      },
      dark: {
        "& [role='img'] svg[data-state='full']": {
          fill: "$catalogTextOnDark",
          stroke: "$catalogTextOnDark",
        },
        "& [role='img'] svg[data-state='empty']": {
          fill: "transparent",
          stroke: "$catalogTextOnDark",
        },
        "& [role='img'] [data-half='fill'] svg": {
          fill: "$catalogTextOnDark",
          stroke: "$catalogTextOnDark",
        },
        "& [role='img'] [data-half='empty'] svg": {
          fill: "transparent",
          stroke: "$catalogTextOnDark",
        },
      },
    },
  },
});
