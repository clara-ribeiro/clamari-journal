import { styled } from "@/styles/stitches.config";

export const Button = styled("button", {
  alignSelf: "flex-start",
  margin: 0,
  marginTop: "$sm",
  padding: "$sm $md",
  fontSize: "$body2",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
  color: "$catalogTextOnDark",
  backgroundColor: "transparent",
  border: "1px solid $catalogBorderOnDark",

  "&:hover": {
    borderColor: "$catalogTextOnDark",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});
