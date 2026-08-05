import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  lineHeight: 0,
});

export const Icon = styled("img", {
  width: "0.85rem",
  height: "auto",
  display: "block",

  "@sm": {
    width: "1rem",
  },
});
