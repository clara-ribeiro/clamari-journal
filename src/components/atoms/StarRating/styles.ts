import { styled } from "@/styles/stitches.config";

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
    fill: "currentColor",
    stroke: "currentColor",
  },

  "& svg[data-state='empty']": {
    color: "$starOff",
  },
});

export const HalfRoot = styled("span", {
  position: "relative",
  display: "inline-block",
  width: "0.75rem",
  height: "0.75rem",
  flexShrink: 0,
  verticalAlign: "middle",

  "& svg": {
    display: "block",
    width: "100%",
    height: "100%",
  },
});
export const EmptyIcon = styled("span", {
  position: "absolute",
  inset: 0,
  color: "$starOff",
});

export const FillIcon = styled("span", {
  position: "absolute",
  inset: 0,
  width: "50%",
  overflow: "hidden",
  color: "$starOn",
});
