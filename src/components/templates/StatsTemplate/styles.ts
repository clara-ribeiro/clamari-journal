import { styled } from "@/styles/stitches.config";

export const Page = styled("main", {
  px: "$lg",
  py: "$2xl",
  maxWidth: "$containerContent",
  mx: "auto",
});

export const Grid = styled("section", {
  display: "grid",
  gap: "$md",
  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
  marginBottom: "$2xl",
});

export const Card = styled("div", {
  background: "$surface",
  border: "1px solid $border",
  borderRadius: "$lg",
  padding: "$lg",
});

export const Value = styled("p", {
  fontFamily: "$heading",
  fontSize: "$h2",
  color: "$primary",
});

export const Label = styled("p", {
  color: "$loContrast",
  fontSize: "$body2",
  marginTop: "$xs",
});
