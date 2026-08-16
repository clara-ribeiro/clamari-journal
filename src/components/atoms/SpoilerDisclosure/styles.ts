import { styled } from "@/styles/stitches.config";

export const Root = styled("details", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
  margin: 0,
  padding: "$sm $md",
  border: "1px solid currentColor",
  color: "inherit",
});

export const Summary = styled("summary", {
  display: "flex",
  alignItems: "center",
  minHeight: "$controlMin",
  cursor: "pointer",
  listStyle: "none",
  fontFamily: "$body",
  fontSize: "$body2",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",

  "&::-webkit-details-marker": {
    display: "none",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

export const Body = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
  paddingBottom: "$sm",
  fontSize: "$body1",
  lineHeight: 1.7,
});
