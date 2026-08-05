import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  margin: 0,
});

export const Title = styled("h1", {
  margin: 0,
  fontFamily: "var(--font-anton), Impact, Haettenschweiler, sans-serif",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "clamp(3.25rem, 25vw, 60rem)",
  lineHeight: 0.9,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  textAlign: "center",
  whiteSpace: "nowrap",
  color: "transparent",
  backgroundImage: "url(/images/home/hero/lettering-background-mobile.webp)",
  backgroundSize: "cover",
  backgroundPosition: "center 28%",
  backgroundRepeat: "no-repeat",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  filter:
    "drop-shadow(0 0.12em 0.18em rgba(0, 0, 0, 0.35)) drop-shadow(0 0.04em 0.06em rgba(0, 0, 0, 0.35))",

  "@media (max-width: 767px)": {
    width: "100%",
  },

  "@media (min-width: 768px)": {
    backgroundImage: "url(/images/home/hero/lettering-background.webp)",
  },
});
