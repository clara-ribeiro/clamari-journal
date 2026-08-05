import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "inline-flex",
  width: "auto",
  margin: 0,

  "@media (max-width: 767px)": {
    display: "flex",
    width: "100%",
  },
});

export const ButtonLink = styled(Link, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  width: "auto",
  minHeight: "$controlMin",
  paddingInline: "$lg",
  paddingBlock: "$sm",
  border: "none",
  borderRadius: "$full",
  outline: "2px solid $buttonText",
  outlineOffset: "-0.35rem",
  backgroundColor: "$buttonSurface",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "140px 140px",
  backgroundRepeat: "repeat",
  backgroundBlendMode: "multiply",
  color: "$buttonText",
  fontFamily: "$heading",
  fontSize: "$body1",
  fontWeight: 500,
  letterSpacing: "0.01em",
  lineHeight: 1,
  textDecoration: "none",
  overflow: "hidden",
  transition:
    "transform 200ms ease, box-shadow 200ms ease, filter 200ms ease",
  boxShadow: "0 0 0 0 rgba(245, 210, 58, 0)",

  "&:hover": {
    transform: "translateY(-0.125rem)",
    boxShadow: "0 0 1.25rem 0.1rem rgba(245, 210, 58, 0.35)",
  },

  "&:active": {
    transform: "translateY(0)",
  },

  "@media (max-width: 767px)": {
    width: "100%",
  },

  "@motionReduce": {
    transition: "none",
    "&:hover": {
      transform: "none",
    },
  },
});
