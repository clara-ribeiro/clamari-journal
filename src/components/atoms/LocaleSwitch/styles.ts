import { styled } from "@/styles/stitches.config";

const optionStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "$controlMin",
  margin: 0,
  padding: "0 $xs",
  fontFamily: "$body",
  fontWeight: 500,
  fontSize: "$caption",
  lineHeight: 1,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textDecoration: "none",
  textUnderlineOffset: "0.18em",
  whiteSpace: "nowrap",
  background: "none",
  border: 0,
  transition: "opacity $fast ease",

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },

  variants: {
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
    current: {
      true: {
        textDecoration: "underline",
      },
      false: {
        opacity: 0.72,
      },
    },
  },

  defaultVariants: {
    tone: "navy",
    current: false,
  },

  "@motionReduce": {
    transition: "none",
  },
} as const;

export const Root = styled("nav", {
  display: "flex",
  alignItems: "center",
  gap: "$xs",
  flexShrink: 0,
});

export const Current = styled("span", optionStyles);

/** Native `<a>` so EN ↔ PT (separate root layouts) does a full document load. */
export const Choice = styled("a", {
  ...optionStyles,
  cursor: "pointer",

  "&:hover": {
    opacity: 1,
    textDecoration: "underline",
  },
});

export const Divider = styled("span", {
  opacity: 0.45,
  userSelect: "none",
  fontFamily: "$body",
  fontSize: "$caption",
  lineHeight: 1,
});
