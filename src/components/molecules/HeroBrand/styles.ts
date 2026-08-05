import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
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
  zIndex: 1,
  marginTop: "-0.78em",
  width: "100%",
});
