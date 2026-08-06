import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
});

export const ScriptLayer = styled("div", {
  zIndex: 1,
  marginTop: "-0.78em",
});
