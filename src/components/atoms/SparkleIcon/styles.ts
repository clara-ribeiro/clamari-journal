import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  lineHeight: 0,
  color: "$brandAccent",
});

export const Icon = styled("svg", {
  width: "0.85rem",
  height: "auto",
  display: "block",
  aspectRatio: "24 / 30",
  filter:
    "drop-shadow(0 0 0.15rem rgba(10, 30, 58, 0.55)) drop-shadow(0 0.05rem 0.08rem rgba(10, 30, 58, 0.4))",

  "@sm": {
    width: "1rem",
  },
});
