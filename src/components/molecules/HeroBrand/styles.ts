import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "min(100%, 56rem)",
  margin: 0,

  "@media (max-width: 767px)": {
    width: "100%",
  },
});

export const ScriptLayer = styled("div", {
  position: "relative",
  zIndex: 1,
  marginTop: "-0.78em",
  width: "100%",
});
