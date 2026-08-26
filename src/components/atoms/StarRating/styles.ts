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
