import { keyframes, styled } from "@/styles/stitches.config";

const reveal = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.5rem)",
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
  pointerEvents: "none",
  animation: `${reveal} 700ms cubic-bezier(0.2, 0, 0, 1) 120ms both`,

  "@motionReduce": {
    animation: "none",
  },
});

export const Script = styled("p", {
  margin: 0,
  fontFamily: 'var(--font-monsieur), "Segoe Script", cursive',
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "clamp(2.75rem, 20vw, 15rem)",
  lineHeight: 0.85,
  color: "$brandAccent",
  textAlign: "center",
});
