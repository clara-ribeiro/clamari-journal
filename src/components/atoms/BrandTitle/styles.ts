import { keyframes, styled } from "@/styles/stitches.config";

const reveal = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.4rem)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const Root = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  margin: 0,
  animation: `${reveal} 700ms cubic-bezier(0.2, 0, 0, 1) both`,

  "@motionReduce": {
    animation: "none",
  },
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
  color: "transparent",
  backgroundImage: "url(/images/home/hero/lettering-background.webp)",
  backgroundSize: "cover",
  backgroundPosition: "center 28%",
  backgroundRepeat: "no-repeat",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});
