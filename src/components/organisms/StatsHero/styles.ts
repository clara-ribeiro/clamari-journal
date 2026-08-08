import { keyframes, styled } from "@/styles/stitches.config";

const grain = "url(/images/shared/noise-grain.webp)";

const fadeRise = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(1.25rem)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: 0,
  width: "100%",
  overflowX: "hidden",
  paddingTop: "$2xl",
  paddingBottom: "clamp(2rem, 6vw, 7rem)",
  backgroundColor: "$statsHeroBg",
  backgroundImage: grain,
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  color: "$hiContrast",
  isolation: "isolate",

  "@md": {
    paddingTop: "$xl",
  },
});

export const Title = styled("h1", {
  zIndex: 1,
  margin: 0,
  marginBottom: "clamp(-1.5rem, -14vw, -3rem)",
  paddingInline: "$md",
  fontFamily: "$bivaque",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "clamp(3.5rem, 22vw, 7rem)",
  lineHeight: 0.82,
  letterSpacing: "0.01em",
  textTransform: "uppercase",
  textAlign: "center",
  whiteSpace: "nowrap",
  color: "#E8E8E8",
  userSelect: "none",
  animation: `${fadeIn} $slow ease-out both`,

  "@md": {
    paddingInline: "$xl",
    fontSize: "clamp(5rem, 18vw, 15rem)",
  },

  "@motionReduce": {
    animation: "none",
  },
});

export const Figure = styled("div", {
  zIndex: 2,
  width: "90%",
  maxWidth: "$containerWide",
  animation: `${fadeRise} $slow ease-out both`,
  animationDelay: "120ms",
  pointerEvents: "none",
  marginTop: "-0.5rem",

  "@md": {
    marginTop: "-2.5rem",
    width: "60%",
  },

  "& img": {
    width: "100%",
    height: "auto",
    objectFit: "contain",
    objectPosition: "center bottom",
  },

  "@motionReduce": {
    animation: "none",
  },
});
