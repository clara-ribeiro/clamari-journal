import { styled } from "@/styles/stitches.config";

export const Root = styled("span", {
  position: "relative",
  display: "inline-flex",
  verticalAlign: "middle",
  maxWidth: "100%",
  pointerEvents: "auto",
  cursor: "help",

  "&:hover, &:focus-visible, &:focus-within": {
    zIndex: 2,
  },

  "&:hover [data-status-hint], &:focus-visible [data-status-hint], &:focus-within [data-status-hint]":
    {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },

  "&:focus-visible": {
    outline: "0.125rem solid $focus",
    outlineOffset: "0.15rem",
  },

  variants: {
    placement: {
      start: {},
      end: {},
      stretch: {
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
      },
    },
  },

  defaultVariants: {
    placement: "end",
  },
});

export const Bubble = styled("span", {
  position: "absolute",
  top: "calc(100% + 0.35rem)",
  zIndex: "$overlay",
  boxSizing: "border-box",
  width: "max-content",
  maxWidth: "min(18rem, 72vw)",
  padding: "0.4rem 0.55rem",
  backgroundColor: "#1A1410",
  color: "#F1DFC2",
  fontFamily: "$body",
  fontSize: "$caption",
  fontWeight: 500,
  lineHeight: 1.35,
  textAlign: "left",
  whiteSpace: "normal",
  boxShadow: "$md",
  opacity: 0,
  visibility: "hidden",
  pointerEvents: "none",
  transform: "translateY(-0.15rem)",
  transition: "opacity $fast, transform $fast, visibility $fast",

  "@motionReduce": {
    transition: "none",
  },

  variants: {
    placement: {
      end: {
        right: 0,
        left: "auto",
      },
      start: {
        left: 0,
        right: "auto",
      },
      stretch: {
        left: 0,
        right: 0,
        width: "auto",
        maxWidth: "100%",
      },
    },
  },

  defaultVariants: {
    placement: "end",
  },
});
