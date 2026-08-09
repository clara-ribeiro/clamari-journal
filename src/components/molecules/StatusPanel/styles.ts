import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Title = styled("h1", {
  margin: 0,
  fontFamily: "$section",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  lineHeight: 1.15,
  color: "$catalogTextOnDark",
});

export const Message = styled("p", {
  margin: 0,
  maxWidth: "28rem",
  fontSize: "$body1",
  lineHeight: 1.6,
  color: "$catalogMutedOnDark",
});

export const Actions = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "$md",
  marginTop: "$md",
});

export const HomeLink = styled(Link, {
  display: "inline-flex",
  alignItems: "center",
  gap: "$xs",
  margin: 0,
  padding: 0,
  fontSize: "$body1",
  lineHeight: 1.4,
  letterSpacing: "0.01em",
  textTransform: "none",
  textDecoration: "underline",
  textUnderlineOffset: "0.18em",
  textDecorationThickness: "1px",
  color: "$catalogTextOnDark",
  backgroundColor: "transparent",
  border: "none",

  "&:hover": {
    color: "$hiContrast",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

export const RetryButton = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "$buttonHeight",
  px: "$xl",
  py: "$sm",
  margin: 0,
  fontSize: "$body2",
  letterSpacing: "0.06em",
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
