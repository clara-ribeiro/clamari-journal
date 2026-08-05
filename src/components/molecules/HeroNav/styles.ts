import { keyframes, styled } from "@/styles/stitches.config";

const reveal = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.75rem)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const Root = styled("nav", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: "$md",
  width: "100%",
  maxWidth: "40rem",
  margin: 0,
  animation: `${reveal} 700ms cubic-bezier(0.2, 0, 0, 1) 220ms both`,

  "@sm": {
    gap: "$lg",
  },

  "@motionReduce": {
    animation: "none",
  },
});
