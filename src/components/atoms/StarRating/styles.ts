import { styled } from "@/styles/stitches.config";

const starStroke = {
  stroke: "$buttonText",
  strokeWidth: 2.25,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

export const Root = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.125rem",
  color: "$starOn",

  "& svg": {
    display: "block",
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
    overflow: "visible",
  },

  "& svg[data-state='full']": {
    fill: "$starOn",
    ...starStroke,
  },

  "& svg[data-state='empty']": {
    fill: "$starOff",
    ...starStroke,
  },
});

export const HalfRoot = styled("span", {
  display: "inline-flex",
  width: "0.75rem",
  height: "0.75rem",
  flexShrink: 0,
  verticalAlign: "middle",
});

export const FillClip = styled("span", {
  display: "block",
  width: "50%",
  height: "100%",
  overflow: "hidden",
  color: "$starOn",

  "& svg": {
    display: "block",
    width: "0.75rem",
    height: "0.75rem",
    fill: "$starOn",
    ...starStroke,
  },
});

export const EmptyClip = styled("span", {
  display: "block",
  width: "50%",
  height: "100%",
  overflow: "hidden",
  color: "$starOff",

  "& svg": {
    display: "block",
    width: "0.75rem",
    height: "0.75rem",
    marginLeft: "-0.375rem",
    fill: "currentColor",
    ...starStroke,
  },
});
